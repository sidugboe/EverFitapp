const router = require("express").Router();
const auth = require("../auth");
const db = require("../db");

const _modelName = "ExerciseTemplate";

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
        const User = await db.userDb.model("User");

        const pubExercise = await model
            .findOne({ $or: [{ _id: req.params.id, access: "public" }, { _id: req.params.id, access: "unlisted" }] })
            .populate("muscle", "", Muscle)
            .populate("creatorId", "name username profilePicURL", User);
        if (pubExercise && req.user._id != pubExercise.creatorId._id) return res.status(200).json(pubExercise);

        const exercise = await model
            .findOne({ _id: req.params.id, creatorId: req.user._id })
            .populate("muscle", "", Muscle)
            .populate("creatorId", "", User);
        if (!exercise) return res.status(404).json({ message: `Exercise template id ${req.params.id} not found.` });

        return res.status(200).json(exercise);
    }
    catch (err) {
        if (err.name === "CastError") return res.status(404).json({ message: `Exercise template id ${req.params.id} not found.` });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.post("/:id/like", auth, async (req, res) => {
    try {
        const Exercise = await db.exerciseDb.model(_modelName);
        const User = await db.userDb.model("User");

        const exercise = await Exercise
            .findOne({ _id: req.params.id })
            .populate("creatorId", "name username profilePicURL", User);
        if (!exercise) return res.status(404).json({ message: `Exercise id ${req.params.id} not found.` });

        if (exercise.access == "private" && exercise.creatorId._id != req.user._id)
            return res.status(404).json({ message: `Exercise id ${req.params.id} not found.` });

        // check like list
        const liked = exercise.likes.indexOf(req.user._id);

        if (liked > -1) return res.status(200).json({ message: "Success." });

        // add userId to likess
        exercise.likes.push(req.user._id);
        await exercise.save();

        return res.status(200).json({ message: "Success." });
    }
    catch (err) {
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid id." });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.post("/:id/unlike", auth, async (req, res) => {
    try {
        const Exercise = await db.exerciseDb.model(_modelName);
        const User = await db.userDb.model("User");

        const exercise = await Exercise
            .findOne({ _id: req.params.id })
            .populate("creatorId", "name username profilePicURL", User);
        if (!exercise) return res.status(404).json({ message: `Exercise id ${req.params.id} not found.` });

        if (exercise.access == "private" && exercise.creatorId._id != req.user._id)
            return res.status(404).json({ message: `Exercise id ${req.params.id} not found.` });

        // check like list
        const liked = exercise.likes.indexOf(req.user._id);

        if (liked < 0) return res.status(200).json({ message: "Success." });

        // remove userId from likes
        exercise.likes.splice(liked, 1);
        await exercise.save();

        return res.status(200).json({ message: "Success." });
    }
    catch (err) {
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid id." });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});


router.post("/", auth, async (req, res) => {
    try {
        const model = await db.exerciseDb.model(_modelName);
        const exercise = await model.findOne({ name: req.body.name, creatorId: req.user._id });
        const exerciseId = await model.findOne({ _id: req.body._id });
        if (exercise) return res.status(400).json({ message: `Exercise "${req.body.name}" already exists.` });
        if (exerciseId) return res.status(400).json({ message: `Exercise "${req.body._id}" already exists.` });

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

        req.body.creatorId = req.user._id;
        const exercise = await model.findOneAndUpdate({ _id: req.body._id, creatorId: req.user._id }, req.body, { new: true });
        if (!exercise) return res.status(400).json({ message: `Exercise {id: ${req.body._id}} does not exist.` });

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
        if (!exercise) return res.status(404).json({ message: `Exercise ${req.params.id} not found.` });

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