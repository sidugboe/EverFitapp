const router = require("express").Router();
const auth = require("../auth");
const db = require("../db");
const dateCompare = require("../utils/dateCompare");
const likeCount = require("../utils/likeCount");

router.get("/", auth, async (req, res) => {
    try {
        const User = await db.userDb.model("User");
        const Post = await db.postDb.model("Post");

        const { following } = await User.findOne({ _id: req.user._id });

        let feed = [];
        for (let id of following) {
            let f = await Post
                .find({ creatorId: id })
                .select("+likes +dislikes")
                .populate("creatorId", "name username profilePicURL", User)
                .lean();
            feed.map(likeCount);
            feed = feed.concat(f);
        }
        const sortedFeed = feed.sort(dateCompare);
        return res.status(200).json(sortedFeed);
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

module.exports = router;