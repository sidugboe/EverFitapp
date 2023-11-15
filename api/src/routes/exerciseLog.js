const router = require("express").Router();
const auth = require("../auth");
const db = require("../db");

const _modelName = "ExerciseLog";

router.get("/", auth, async (req, res) => {
    try {
        const model = await db.exerciseDb.model(_modelName);
        const Muscle = await db.muscleGroupDb.model("Muscle");

        if (!req.query.name) {
            const data = await model.find({ creatorId: req.user._id }).populate("muscle", "", Muscle);
            return res.status(200).json(data);
        }

        // search for matches on start of 'name'
        const queryEx = await model.find(
            {
                creatorId: req.user._id,
                name: {
                    $regex: `^${req.query.name.toLowerCase()}`,
                    $options: "i"
                }
            })
            .populate("muscle", "", Muscle);
        return res.status(200).json(queryEx);
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.get("/:id", auth, async (req, res) => {
    try {
        const model = await db.exerciseDb.model(_modelName);
        const Muscle = await db.muscleGroupDb.model("Muscle");
        const ExerciseTemplate = await db.exerciseDb.model("ExerciseTemplate");
        const User = await db.userDb.model("User");

        const exercise = await model
            .findOne({ _id: req.params.id })
            .populate("muscle", "", Muscle)
            .populate("exerciseTemplate", "", ExerciseTemplate)
            .populate("creatorId", "name username profilePicURL", User);
        if (!exercise) return res.status(404).json({ message: `Exercise log ${req.params.id} not found.` });

        // belongs to user
        if (exercise.creatorId._id == req.user._id) return res.status(200).json(exercise);

        const user = await User.findOne({ _id: exercise.creatorId._id });

        // public profile & public log
        if (user.visibility === "public" && exercise.access === "public") return res.status(200).json(exercise);

        const followed = user.followers.find(id => id == req.user._id);
        
        // being viewed by follower
        if (followed && exercise.access === "public") return res.status(200).json(exercise);

        return res.status(200).json(exercise);
    }
    catch (err) {
        if (err.name === "CastError") return res.status(400).json({ message: `Exercise log id ${req.params.id} not found.` });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.post("/", auth, async (req, res) => {
    try {
        const model = await db.exerciseDb.model(_modelName);
        const ETemplate = await db.exerciseDb.model("ExerciseTemplate");

        const exerciseId = await model.findOne({ _id: req.body._id });
        const exerciseTemplate = await ETemplate.findOne({ _id: req.body.exerciseTemplate });
        if (exerciseId) return res.status(400).json({ message: `Exercise log "${req.body._id}" already exists.` });
        if (!exerciseTemplate) return res.status(404).json({ message: `Exercise template "${req.body.exerciseTemplate}" not found.` });

        req.body.creatorId = req.user._id;
        const data = new model(req.body);

        const response = await data.save();
        return res.status(201).json({ message: "Success.", data: response });
    }
    catch (err) {
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid id." });
        if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.put("/", auth, async (req, res) => {
    try {
        const model = await db.exerciseDb.model(_modelName);
        const ETemplate = await db.exerciseDb.model("ExerciseTemplate");

        const exerciseTemplate = await ETemplate.findOne({ exerciseTemplate: req.body.exerciseTemplate });
        if (!exerciseTemplate) return res.status(404).json({ message: `Exercise log "${req.body.exerciseTemplate}" not found.` });

        req.body.creatorId = req.user._id;
        const exercise = await model.findOneAndUpdate({ _id: req.body._id, creatorId: req.user._id }, req.body, { new: true });
        if (!exercise) return res.status(400).json({ message: `Exercise log ${req.body._id} not found.` });

        return res.status(201).json({ message: "Success.", data: exercise });
    }
    catch (err) {
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid id." });
        if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const model = await db.exerciseDb.model(_modelName);

        const exercise = await model.findOne({ _id: req.params.id, creatorId: req.user._id });
        if (!exercise) return res.status(404).json({ message: `Exercise log ${req.params.id} not found.` });

        await model.deleteOne({ _id: req.params.id, creatorId: req.user._id });
        return res.status(200).json({ message: "Success." });
    }
    catch (err) {
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid id." });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

module.exports = router;