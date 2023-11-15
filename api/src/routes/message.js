const router = require("express").Router();
const auth = require("../auth");
const db = require("../db");

const dateCompare = require("../utils/dateCompare");
const messageUserIds = require("../utils/messageUserIds");

const _modelName = "Message";

// get messages
router.get("/", auth, async (req, res) => {
    try {
        const Message = await db.messageDb.model(_modelName);
        const User = await db.userDb.model("User");

        const messages = await Message
            .find({ $or: [{ creatorId: req.user._id }, { recipientId: req.params.id }] })
            .populate("creatorId", "name profilePicURL", User)
            .populate("recipientId", "name profilePicURL", User)
            .lean();
        if (!messages) return res.status(404).json({ message: "Messages not found." });

        const sortedMessages = messages.sort(dateCompare);
        const filteredUsers = messageUserIds(sortedMessages).filter(u => u._id != req.user._id);
        return res.status(200).json(filteredUsers);
    }
    catch (err) {
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid id." });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

// get messages with a user by id
router.get("/user/:id", auth, async (req, res) => {
    try {
        const Message = await db.messageDb.model(_modelName);
        const User = await db.userDb.model("User");

        const messages = await Message
            .find({
                $or: [
                    { creatorId: req.user._id, recipientId: req.params.id },
                    { creatorId: req.params.id, recipientId: req.user._id }
                ]
            })
            .populate("creatorId", "name", User)
            .populate("recipientId", "name", User)
            .lean();
        if (!messages) return res.status(404).json({ message: `Messages with user id ${req.params.id} not found.` });

        const sortedMessages = messages.sort(dateCompare);
        return res.status(200).json(sortedMessages);
    }
    catch (err) {
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid id." });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.post("/", auth, async (req, res) => {
    try {
        const Message = await db.messageDb.model(_modelName);
        const User = await db.userDb.model("User");

        const recipient = await User.findOne({ _id: req.body.recipientId });
        if (!recipient) return res.status(404).json({ message: `Recipient id ${req.params.id} not found.` });

        const user = await User.findOne({ _id: req.user._id });

        // must follow eachother
        const following = recipient.followers.find(id => id == req.user._id);
        const follower = user.followers.find(id => id == req.body.recipientId);
        if (!following || !follower)
            return res.status(400).json({ message: `Must be following user ${req.body.recipientId} or be a follower.` });

        req.body.creatorId = req.user._id;
        const message = new Message(req.body);
        const data = await message.save();
        return res.status(200).json({ message: "Success.", data });
    }
    catch (err) {
        if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

module.exports = router;