const router = require("express").Router();
const auth = require("../auth");
const db = require("../db");

const _modelName = "CheckInTemplate";

router.use("/logs", require("./checkInLog"));

router.get("/templates", auth, async (req, res) => {
    try {
        const CheckIn = await db.checkInDb.model(_modelName);

        const data = await CheckIn
            .find({ creatorId: req.user._id });
        return res.status(200).json(data);
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.get("/templates/:id", auth, async (req, res) => {
    try {
        const CheckIn = await db.checkInDb.model(_modelName);
        const User = await db.userDb.model("User");

        const checkIn = await CheckIn
            .findOne({ _id: req.params.id })
            .populate("creatorId", "name username profilePicURL", User);

        if (!checkIn) return res.status(404).json({ message: `Check In id ${req.params.id} not found.` });
        if (checkIn.creatorId._id == req.user._id) return res.status(200).json(checkIn);
        if (checkIn.access == "private") return res.status(404).json({ message: `Check In id ${req.params.id} not found.` });

        const owner = await User.findOne({ _id: checkIn.creatorId._id });
        const followed = owner.followers.find(id => id == req.user._id);

        // follower or public profile
        if (owner.visibility == "public" || followed)
            return res.status(200).json(checkIn);

        return res.status(404).json({ message: `Check In id ${req.params.id} not found.` });
    }
    catch (err) {
        if (err.name === "CastError") return res.status(400).json({ message: `Invalid Check In id ${req.params.id}.` });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.post("/templates", auth, async (req, res) => {
    try {
        const CheckIn = await db.checkInDb.model(_modelName);

        const public = await CheckIn.findOne({ name: req.body.name, creatorId: req.user._id });
        const checkin = await CheckIn.findOne({ _id: req.body._id });
        if (public) return res.status(400).json({ message: `Check In "${req.body.name}" already exists.` });
        if (checkin) return res.status(400).json({ message: `Check In id ${req.body._id} already exists.` });

        delete req.body._id;
        req.body.creatorId = req.user._id;
        const data = new CheckIn(req.body);

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

router.put("/templates", auth, async (req, res) => {
    try {
        const CheckIn = await db.checkInDb.model(_modelName);

        req.body.creatorId = req.user._id;
        const checkIn = await CheckIn
            .findOneAndUpdate(
                { _id: req.body._id, creatorId: req.user._id },
                req.body,
                { runValidators: true, new: true });
        if (!checkIn) return res.status(400).json({ message: `Check In id ${req.body._id} not found.` });

        return res.status(201).json({ message: "Success.", data: checkIn });
    }
    catch (err) {
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid id." });
        if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.delete("/templates/:id", auth, async (req, res) => {
    try {
        const CheckIn = await db.checkInDb.model(_modelName);

        const data = await CheckIn.findOne({ _id: req.params.id, creatorId: req.user._id });
        if (!data) return res.status(404).json({ message: `Check In id ${req.params.id} not found.` });

        await CheckIn.deleteOne({ _id: req.params.id, creatorId: req.user._id });
        return res.status(200).json({ message: "Success." });
    }
    catch (err) {
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid id." });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

module.exports = router;