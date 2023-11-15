const router = require("express").Router();
const auth = require("../auth");
const db = require("../db");

const likeCount = require("../utils/likeCount");
const dateCompare = require("../utils/dateCompare");

router.get("/:tag", auth, async (req, res) => {
    try {
        const Post = await db.postDb.model("Post");
        const User = await db.userDb.model("User");

        let data = await Post
            .find({ tags: req.params.tag })
            .populate("creatorId", "name username profilePicURL visibility", User)
            .lean();
        if (!data) return res.status(404).json({ message: `Post id ${req.params.id} not found.` });

        data = data.filter(item => item.creatorId.visibility == "public");
        data.map(likeCount);

        return res.status(200).json(data.sort(dateCompare));
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

module.exports = router;