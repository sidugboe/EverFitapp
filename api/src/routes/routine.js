const router = require("express").Router();
const auth = require("../auth");
const db = require("../db");

const _modelName = "Routine";

router.get("/", auth, async (req, res) => {  //this route gets every routine for a single user
    const model = await db.routineDb.model(_modelName);
    const WorkoutTemplate = await db.workoutTemplateDb.model("WorkoutTemplate");

    const data = await model
        .find({ creatorId: req.user._id })
        .populate("workoutTemplates", "", WorkoutTemplate);
    return res.status(200).json(data);
});

router.get("/id/:id", auth, async (req, res) => { //this route gets a specific routine with a specified id
    try {
        const model = await db.routineDb.model(_modelName);
        const WorkoutTemplate = await db.workoutTemplateDb.model("WorkoutTemplate");
        const User = await db.userDb.model("User");

        const routine = await model
            .findOne({ _id: req.params.id })
            .populate("creatorId", "name username profilePicURL", User)
            .populate("likes", "name username profilePicURL", User)
            .populate("workoutTemplates", "", WorkoutTemplate);
        if (!routine) return res.status(404).json({ message: `Routine id ${req.params.id} not found.` });

        // routine belongs to user
        if (routine.creatorId._id == req.user._id) return res.status(200).json(routine);

        // routine is public
        if (routine.access == "private") return res.status(404).json({ message: `Routine id ${req.params.id} not found.` });

        return res.status(200).json(routine);
    }
    catch (err) {
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid id." });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.post("/id/:id/like", auth, async (req, res) => {
    try {
        const Routine = await db.routineDb.model(_modelName);
        const User = await db.userDb.model("User");

        const routine = await Routine
            .findOne({ _id: req.params.id })
            .populate("creatorId", "name username profilePicURL", User);
        if (!routine) return res.status(404).json({ message: `Routine id ${req.params.id} not found.` });

        if (routine.access == "private" && routine.creatorId._id != req.user._id)
            return res.status(404).json({ message: `Routine id ${req.params.id} not found.` });

        // check like list
        const liked = routine.likes.indexOf(req.user._id);

        if (liked > -1) return res.status(200).json({ message: "Success." });

        // add userId to likess
        routine.likes.push(req.user._id);
        await routine.save();

        return res.status(200).json({ message: "Success." });
    }
    catch (err) {
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid id." });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.post("/id/:id/unlike", auth, async (req, res) => {
    try {
        const Routine = await db.routineDb.model(_modelName);
        const User = await db.userDb.model("User");

        const routine = await Routine
            .findOne({ _id: req.params.id })
            .populate("creatorId", "name username profilePicURL", User);
        if (!routine) return res.status(404).json({ message: `Routine id ${req.params.id} not found.` });

        if (routine.access == "private" && routine.creatorId._id != req.user._id)
            return res.status(404).json({ message: `Routine id ${req.params.id} not found.` });

        // check like list
        const liked = routine.likes.indexOf(req.user._id);

        if (liked < 0) return res.status(200).json({ message: "Success." });

        // remove userId from likes
        routine.likes.splice(liked, 1);
        await routine.save();

        return res.status(200).json({ message: "Success." });
    }
    catch (err) {
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid id." });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.get("/user/:id", auth, async (req, res) => {
    try {
        const model = await db.routineDb.model(_modelName);

        if (req.params.id == req.user._id) {
            const data = await model
                .find({ creatorId: req.params.id });
            return res.status(200).json(data);
        }

        const data = await model
            .find({ creatorId: req.params.id, access: "public" });
        return res.status(200).json(data);
    }
    catch (err) {
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid id." });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.post("/", auth, async (req, res) => { //this route creates new routine
    try {
        const model = await db.routineDb.model(_modelName);
        const routineName = await model.findOne({ name: req.body.name, creatorId: req.body._id });
        if (routineName) return res.status(400).json({ message: `Routine "${req.body._id}" already exists.` });

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

router.put("/", auth, async (req, res) => { //this route edits an existing routine
    try {
        const model = await db.routineDb.model(_modelName);

        const routineName = await model.findOne({ _id: req.body._id, creatorId: req.user._id });
        if (!routineName) return res.status(404).json({ message: `Routine "${req.body._id}" does not exist.` });

        const routine = await model.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true });
        if (!routine) return res.status(400).json({ message: `Routine {id: ${req.body.id}} does not exist.` });

        return res.status(201).json({ message: "Success.", data: routine });
    }
    catch (err) {
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid id." });
        if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.delete("/:id", auth, async (req, res) => {
    const model = await db.routineDb.model(_modelName);
    try {
        await model.deleteOne({ _id: req.params.id, creatorId: req.user._id });

        const workout = await model.findOne({ _id: req.params.id, creatorId: req.user._id });
        if (!workout) return res.status(404).json({ message: `Routine Id "${req.params.id}" not found.` });

        return res.status(200).json({ message: "Success." });
    }
    catch (err) {
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid id." });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

module.exports = router;