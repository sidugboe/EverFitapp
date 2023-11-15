const router = require("express").Router();
const auth = require("../auth");
const db = require("../db");

const _modelName = "WorkoutLog";

router.get("/", auth, async (req, res) => {
    try {
        const model = await db.workoutTemplateDb.model(_modelName);
        const exercise = await db.exerciseDb.model("ExerciseLog");

        if (!req.query.name) {
            const data = await model
                .find({ creatorId: req.user._id })
                .populate("exerciseLogs", "name", exercise);
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
            .populate("exerciseLogs", "name", exercise);
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
        const exercise = await db.exerciseDb.model("ExerciseLog");
        const WorkoutTemplate = await db.workoutTemplateDb.model("WorkoutTemplate");
        const User = await db.userDb.model("User");

        const workout = await model
            .findOne({ _id: req.params.id })
            .populate("exerciseLogs", "", exercise)
            .populate("workoutTemplate", "", WorkoutTemplate)
            .populate("creatorId", "name username profilePicURL", User);
        if (!workout) return res.status(404).json({ message: `Workout log id ${req.params.id} not found.` });

        // belongs to user
        if (workout.creatorId._id == req.user._id) return res.status(200).json(workout);

        const user = await User.findOne({ _id: workout.creatorId._id });

        // public profile & public log
        if (user.visibility === "public" && workout.access === "public") return res.status(200).json(workout);

        const followed = user.followers.find(id => id == req.user._id);
        
        // being viewed by follower
        if (followed && workout.access === "public") return res.status(200).json(workout);


        return res.status(200).json(workout);
    }
    catch (err) {
        if (err.name === "CastError") return res.status(404).json({ message: `Workout log id ${req.params.id} not found.` });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.post("/", auth, async (req, res) => {
    try {
        const model = await db.workoutTemplateDb.model(_modelName);
        const WorkoutTemplate = await db.workoutTemplateDb.model("WorkoutTemplate");

        const workoutTemplate = await WorkoutTemplate.findOne({ _id: req.body.workoutTemplate });
        if (!workoutTemplate) return res.status(400).json({ message: `Workout template "${req.body.workoutTemplate}" not found.` });

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

        const workoutId = await model.findOne({ _id: req.body._id, creatorId: req.user._id });
        if (!workoutId) return res.status(404).json({ message: `Workout log "${req.body._id}" does not exist.` });

        const workout = await model.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true });
        if (!workout) return res.status(404).json({ message: `Workout log ${req.body.id} does not exist.` });

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
        if (!workout) return res.status(404).json({ message: `Workout log ${req.params.id} not found.` });

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