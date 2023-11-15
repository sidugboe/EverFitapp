const router = require("express").Router();
const db = require("../db");
const auth = require("../auth");

router.post("/follow/:userId", auth, async (req, res) => {
    try {
        const User = await db.userDb.model("User");

        const user = await User.findOne({ _id: req.user._id });
        const following = await User.findOne({ _id: req.params.userId });
        if (!following) return res.status(401).json({ message: `User ${req.params.userId} not found.` });

        const followed = following.followers.find(id => id == req.user._id);
        if (followed) return res.status(200).json({ message: "Success." });

        following.followers.push(req.user._id);
        user.following.push(following._id);

        await following.save();
        await user.save();

        return res.status(200).json({ message: "Success." });
    }
    catch (err) {
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid user id." });
        console.error(err);
        return res.status(500).json({ message: "Internal server error." });
    }
});

router.post("/unfollow/:userId", auth, async (req, res) => {
    try {
        const User = await db.userDb.model("User");

        const user = await User.findOne({ _id: req.user._id });
        const otherUser = await User.findOne({ _id: req.params.userId });
        if (!otherUser) return res.status(401).json({ message: `User ${req.params.userId} not found.` });

        const userIndex = otherUser.followers.indexOf(req.user._id);
        const otherUserIndex = user.following.indexOf(otherUser._id);
        if (userIndex < 0 && otherUserIndex < 0) return res.status(200).json({ message: "Success." });

        otherUser.followers.splice(userIndex, 1);
        user.following.splice(otherUserIndex, 1);

        await otherUser.save();
        await user.save();

        return res.status(200).json({ message: "Success." });
    }
    catch (err) {
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid user id." });
        console.error(err);
        return res.status(500).json({ message: "Internal server error." });
    }
});

module.exports = router;