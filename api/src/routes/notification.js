const router = require("express").Router();
const auth = require("../auth");
const db = require("../db");

router.get("/", auth, async (req, res) => {
    try {
        const Notification = await db.userDb.model("Notification");
        const User = await db.userDb.model("User");

        const notifs = await Notification
            .findOne({ ownerId: req.user._id })
            .populate("ownerId", "", User);
        if (!notifs) return res.status(404).json({ message: "Notifications not found." });

        return res.status(200).json(notifs);
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.post("/", auth, async (req, res) => {
    try {
        const Notification = await db.userDb.model("Notification");
        const User = await db.userDb.model("User");

        const notifs = await Notification
            .findOne({ ownerId: req.user._id })
            .populate("ownerId", "", User);

        if (!notifs) {
            req.body.ownerId = req.user._id;
            const newNotifs = new Notification(req.body);

            const result = await newNotifs.save();
            return res.status(200).json({ message: "Success.", result });
        }

        notifs.events = notifs.events.concat(req.body.events);
        const result = await notifs.save();
        return res.status(200).json({ message: "Success.", result });
    }
    catch (err) {
        if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

module.exports = router;