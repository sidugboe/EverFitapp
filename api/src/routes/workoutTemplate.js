const router = require("express").Router();
const auth = require("../auth");
const db = require("../db");

const _modelName = "WorkoutTemplate";

router.get("/", auth, async (req, res) => {
    try {
        const model = await db.workoutTemplateDb.model(_modelName);
        const exercise = await db.exerciseDb.model("ExerciseTemplate");

        if (!req.query.name) {
            const data = await model.find({ creatorId: req.user._id }).populate("exerciseTemplates", "", exercise);
            return res.status(200).json(data);
        }

        // search for matches on start of 'name'
        const queryData = await model.find(
            {
                creatorId: req.user._id,
                name: {
                    $regex: `^${req.query.name.toLowerCase()}`,
                    $options: "i"
                }
            })
            .populate("exerciseTemplates", "", exercise);
        return res.status(200).json(queryData);
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.get("/:id", auth, async (req, res) => {
    try {
        const model = await db.workoutTemplateDb.model(_modelName);
        const exercise = await db.exerciseDb.model("ExerciseTemplate");
        const User = await db.userDb.model("User");

        const pubWorkout = await model
            .findOne({ $or: [{ _id: req.params.id, access: "public" }, { _id: req.params.id, access: "unlisted" }] })
            .populate("exerciseTemplates", "", exercise)
            .populate("creatorId", "name username profilePicURL", User);
        if (pubWorkout && req.user._id != pubWorkout.creatorId._id) return res.status(200).json(pubWorkout);

        const workout = await model
            .findOne({ _id: req.params.id, creatorId: req.user._id })
            .populate("exerciseTemplates", "", exercise)
            .populate("creatorId", "", User);
        if (!workout) return res.status(404).json({ message: `Workout template id ${req.params.id} not found.` });

        return res.status(200).json(workout);
    }
    catch (err) {
        if (err.name === "CastError") return res.status(404).json({ message: `Workout template id ${req.params.id} not found.` });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.post("/:id/like", auth, async (req, res) => {
    try {
        const WorkoutTemplate = await db.workoutTemplateDb.model(_modelName);
        const User = await db.userDb.model("User");

        const workout = await WorkoutTemplate
            .findOne({ _id: req.params.id })
            .populate("creatorId", "name username profilePicURL", User);
        if (!workout) return res.status(404).json({ message: `Workout id ${req.params.id} not found.` });

        if (workout.access == "private" && workout.creatorId._id != req.user._id)
            return res.status(404).json({ message: `Workout id ${req.params.id} not found.` });

        // check like list
        const liked = workout.likes.indexOf(req.user._id);

        if (liked > -1) return res.status(200).json({ message: "Success." });

        // add userId to likess
        workout.likes.push(req.user._id);
        await workout.save();

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
        const WorkoutTemplate = await db.workoutTemplateDb.model(_modelName);
        const User = await db.userDb.model("User");

        const workout = await WorkoutTemplate
            .findOne({ _id: req.params.id })
            .populate("creatorId", "name username profilePicURL", User);
        if (!workout) return res.status(404).json({ message: `Workout id ${req.params.id} not found.` });

        if (workout.access == "private" && workout.creatorId._id != req.user._id)
            return res.status(404).json({ message: `Workout id ${req.params.id} not found.` });

        // check like list
        const liked = workout.likes.indexOf(req.user._id);

        if (liked < 0) return res.status(200).json({ message: "Success." });

        // remove userId from likes
        workout.likes.splice(liked, 1);
        await workout.save();

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
        const model = await db.workoutTemplateDb.model(_modelName);
        const workoutName = await model.findOne({ name: req.body.name, creatorId: req.user._id });
        if (workoutName) return res.status(400).json({ message: `Exercise "${req.body._id}" already exists.` });

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
        const model = await db.workoutTemplateDb.model(_modelName);

        const workoutName = await model.findOne({ _id: req.body._id, creatorId: req.user._id });
        if (!workoutName) return res.status(404).json({ message: `Exercise "${req.body._id}" does not exist.` });

        const workout = await model.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true });
        if (!workout) return res.status(404).json({ message: `Exercise {id: ${req.body.id}} does not exist.` });

        return res.status(201).json({ message: "Success.", data: workout });
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
        const model = await db.workoutTemplateDb.model(_modelName);

        const workout = await model.findOne({ _id: req.params.id, creatorId: req.user._id });
        if (!workout) return res.status(404).json({ message: `Workout ${req.params.id} not found.` });

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