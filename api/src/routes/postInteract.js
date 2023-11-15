const router = require("express").Router({ mergeParams: true });
const auth = require("../auth");
const db = require("../db");

const _modelName = "Post";

router.post("/like", auth, async (req, res) => {
    try {
        const Post = await db.postDb.model(_modelName);
        const User = await db.userDb.model("User");

        const post = await Post
            .findOne({ _id: req.params.id })
            .select("+likes +dislikes")
            .populate("creatorId", "name username profilePicURL", User);
        if (!post) return res.status(404).json({ message: `Post id ${req.params.id} not found.` });

        const owner = await User.findOne({ _id: post.creatorId._id });

        // user must be following owner or owner profile is public or owner is user
        const followed = owner.followers.find(id => id == req.user._id);
        if (owner.visibility != "public" && !followed && post.creatorId._id != req.user._id)
            return res.status(404).json({ message: `Post id ${req.params.id} not found.` });

        if (!post.likes) post.likes = [];
        if (!post.dislikes) post.dislikes = [];

        // check like and dislike list
        const liked = post.likes.indexOf(req.user._id);
        const disliked = post.dislikes.indexOf(req.user._id);

        if (liked > -1) return res.status(200).json({ message: "Success." });

        // remove userId from dislikes
        if (disliked > -1) post.dislikes.splice(disliked, 1);

        // add userId to likess
        post.likes.push(req.user._id);
        await post.save();

        return res.status(200).json({ message: "Success." });
    }
    catch (err) {
        if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.post("/dislike", auth, async (req, res) => {
    try {
        const Post = await db.postDb.model(_modelName);
        const User = await db.userDb.model("User");

        const post = await Post
            .findOne({ _id: req.params.id })
            .select("+likes +dislikes")
            .populate("creatorId", "name username profilePicURL", User);
        if (!post) return res.status(404).json({ message: `Post id ${req.params.id} not found.` });

        const owner = await User.findOne({ _id: post.creatorId._id });

        // user must be following owner or owner profile is public or owner is user
        const followed = owner.followers.find(id => id == req.user._id);
        if (owner.visibility != "public" && !followed && post.creatorId._id != req.user._id)
            return res.status(404).json({ message: `Post id ${req.params.id} not found.` });

        if (!post.likes) post.likes = [];
        if (!post.dislikes) post.dislikes = [];

        // check like and dislike list
        const liked = post.likes.indexOf(req.user._id);
        const disliked = post.dislikes.indexOf(req.user._id);

        if (disliked > -1) return res.status(200).json({ message: "Success." });

        // remove userId from likes
        if (liked > -1) post.likes.splice(liked, 1);

        // add userId to dislikes
        post.dislikes.push(req.user._id);
        await post.save();

        return res.status(200).json({ message: "Success." });
    }
    catch (err) {
        if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

// remove like and dislike
router.post("/unlike", auth, async (req, res) => {
    try {
        const Post = await db.postDb.model(_modelName);
        const User = await db.userDb.model("User");

        const post = await Post
            .findOne({ _id: req.params.id })
            .select("+likes +dislikes")
            .populate("creatorId", "name username profilePicURL", User);
        if (!post) return res.status(404).json({ message: `Post id ${req.params.id} not found.` });

        const owner = await User.findOne({ _id: post.creatorId._id });

        // user must be following owner or owner profile is public or owner is user
        const followed = owner.followers.find(id => id == req.user._id);
        if (owner.visibility != "public" && !followed && post.creatorId._id != req.user._id)
            return res.status(404).json({ message: `Post id ${req.params.id} not found.` });

        if (!post.likes) post.likes = [];
        if (!post.dislikes) post.dislikes = [];

        // check like and dislike list
        const liked = post.likes.indexOf(req.user._id);
        const disliked = post.dislikes.indexOf(req.user._id);

        if (disliked < 0 && liked < 0) return res.status(200).json({ message: "Success." });

        // remove userId from likes
        if (liked > -1) post.likes.splice(liked, 1);
        if (disliked > -1) post.dislikes.splice(disliked, 1);

        await post.save();

        return res.status(200).json({ message: "Success." });
    }
    catch (err) {
        if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.get("/comments", auth, async (req, res) => {
    try {
        const Post = await db.postDb.model(_modelName);

        const Comment = await db.postDb.model("Comment");
        const User = await db.userDb.model("User");

        const post = await Post
            .findOne({ _id: req.params.id })
            .populate({
                path: "comments",
                model: Comment,
                populate: {
                    path: "creatorId",
                    select: "name username profilePicURL",
                    model: User
                }
            })
            .populate({
                path: "comments",
                model: Comment,
                populate: {
                    path: "replies",
                    select: "",
                    model: Comment,
                    populate: {
                        path: "creatorId",
                        select: "name username profilePicURL",
                        model: User,
                    }
                }
            });
        if (!post) return res.status(404).json({ message: `Post id ${req.params.id} not found.` });

        const owner = await User.findOne({ _id: post.creatorId._id });

        // user must be following owner or owner profile is public or owner is user
        const followed = owner.followers.find(id => id == req.user._id);
        if (owner.visibility != "public" && !followed && post.creatorId._id != req.user._id)
            return res.status(404).json({ message: `Post id ${req.params.id} not found.` });

        return res.status(200).json(post.comments);
    }
    catch (err) {
        if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

// get a comment and its replies
router.get("/comments/:commentId", auth, async (req, res) => {
    try {
        const Comment = await db.postDb.model("Comment");

        const Post = await db.postDb.model(_modelName);
        const User = await db.userDb.model("User");

        const post = await Post
            .findOne({ _id: req.params.id })
            .populate("creatorId", "name username profilePicURL", User);
        if (!post) return res.status(404).json({ message: `Post id ${req.params.id} not found.` });

        const comment = await Comment
            .findOne({ _id: req.params.commentId })
            .populate("creatorId", "name username profilePicURL", User)
            .populate("parentCommentId", "", Comment)
            .populate({
                path: "replies",
                model: Comment,
                populate: {
                    path: "creatorId",
                    select: "name username profilePicURL",
                    model: User,
                }
            });
        if (!comment) return res.status(404).json({ message: `Comment id ${req.params.commentId} not found.` });

        const owner = await User.findOne({ _id: post.creatorId._id });

        // user must be following owner or owner profile is public or owner is user
        const followed = owner.followers.find(id => id == req.user._id);
        if (owner.visibility != "public" && !followed && post.creatorId._id != req.user._id)
            return res.status(404).json({ message: `Post id ${req.params.id} not found.` });

        return res.status(200).json(comment);
    }
    catch (err) {
        if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

// create comment
router.post("/comments", auth, async (req, res) => {
    try {
        const Post = await db.postDb.model(_modelName);
        const User = await db.userDb.model("User");
        const Comment = await db.postDb.model("Comment");

        const post = await Post
            .findOne({ _id: req.params.id })
            .populate("creatorId", "", User);
        if (!post) return res.status(404).json({ message: `Post id ${req.params.id} not found.` });

        const owner = await User.findOne({ _id: post.creatorId._id });

        // user must be following owner or owner profile is public or owner is user
        const followed = owner.followers.find(id => id == req.user._id);
        if (owner.visibility != "public" && !followed && post.creatorId._id != req.user._id)
            return res.status(404).json({ message: `Post id ${req.params.id} not found.` });

        req.body.creatorId = req.user._id;
        const comment = new Comment(req.body);
        const data = await comment.save();

        if (!post.comments) post.comments = [];
        post.comments.push(data._id);
        await post.save();
        return res.status(200).json({ message: "Success.", data });
    }
    catch (err) {
        if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

// edit comment
router.put("/comments/:commentId", auth, async (req, res) => {
    try {
        const Comment = await db.postDb.model("Comment");
        const Post = await db.postDb.model(_modelName);
        const User = await db.userDb.model("User");

        const post = await Post
            .findOne({ _id: req.params.id })
            .populate("creatorId", "", User);
        if (!post) return res.status(404).json({ message: `Post id ${req.params.id} not found.` });

        const comment = await Comment
            .findOne({ _id: req.params.commentId, creatorId: req.user._id })
            .populate("creatorId", "name username profilePicURL", User)
            .populate("replies.creatorId", "name username profilePicURL", User);
        if (!comment) return res.status(404).json({ message: `Comment id ${req.params.commentId} not found.` });

        const owner = await User.findOne({ _id: post.creatorId._id });

        // user must be following owner or owner profile is public or owner is user
        const followed = owner.followers.find(id => id == req.user._id);
        if (owner.visibility != "public" && !followed && post.creatorId._id != req.user._id)
            return res.status(404).json({ message: `Post id ${req.params.id} not found.` });

        req.body.creatorId = req.user._id;

        await Comment.findOneAndUpdate({ _id: req.params.commentId }, req.body);
        return res.status(200).json({ message: "Success." });
    }
    catch (err) {
        if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.delete("/comments/:commentId", auth, async (req, res) => {
    try {
        const Comment = await db.postDb.model("Comment");
        const Post = await db.postDb.model(_modelName);
        const User = await db.userDb.model("User");

        const post = await Post
            .findOne({ _id: req.params.id })
            .populate("creatorId", "", User);
        if (!post) return res.status(404).json({ message: `Post id ${req.params.id} not found.` });

        const owner = await User.findOne({ _id: post.creatorId._id });

        // user must be following owner or owner profile is public or owner is user
        const followed = owner.followers.find(id => id == req.user._id);
        if (owner.visibility != "public" && !followed && post.creatorId._id != req.user._id)
            return res.status(404).json({ message: `Post id ${req.params.id} not found.` });

        const comment = await Comment.findOne({ _id: req.params.commentId, creatorId: req.user._id });
        if (!comment) return res.status(404).json({ message: `Comment id ${req.params.commentId} not found.` });

        const commentIndex = post.comments.findIndex(comment => comment._id == req.params.commentId);
        if (commentIndex < 0) return res.status(404).json({ message: `Comment id ${req.params.commentId} not found.` });

        // remove comment from comments
        post.comments.splice(commentIndex, 1);
        await post.save();

        await Comment.deleteOne({ _id: req.params.commentId, creatorId: req.user._id });
        return res.status(200).json({ message: "Success." });
    }
    catch (err) {
        if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

// get replies to comment
router.get("/comments/:commentId/replies", auth, async (req, res) => {
    try {
        const Comment = await db.postDb.model("Comment");
        const Post = await db.postDb.model(_modelName);
        const User = await db.userDb.model("User");

        const post = await Post
            .findOne({ _id: req.params.id })
            .populate("creatorId", "", User);
        if (!post) return res.status(404).json({ message: `Post id ${req.params.id} not found.` });

        const owner = await User.findOne({ _id: post.creatorId._id });

        // user must be following owner or owner profile is public or owner is user
        const followed = owner.followers.find(id => id == req.user._id);
        if (owner.visibility != "public" && !followed && post.creatorId._id != req.user._id)
            return res.status(404).json({ message: `Post id ${req.params.id} not found.` });

        const comment = await Comment
            .findOne({ _id: req.params.commentId })
            .populate({
                path: "replies",
                model: Comment,
                populate: {
                    path: "creatorId",
                    select: "name username profilePicURL",
                    model: User
                }
            })
            .populate({
                path: "replies",
                model: Comment,
                populate: {
                    path: "replies",
                    select: "",
                    model: Comment,
                    populate: {
                        path: "creatorId",
                        select: "name username profilePicURL",
                        model: User,
                    }
                }
            })
            .populate({
                path: "replies",
                model: Comment,
                populate: {
                    path: "parentCommentId",
                    select: "",
                    model: Comment,
                    populate: {
                        path: "creatorId",
                        select: "name username profilePicURL",
                        model: User,
                    }
                }
            });
        if (!comment) return res.status(404).json({ message: `Comment id ${req.params.commentId} not found.` });

        return res.status(200).json(comment.replies);
    }
    catch (err) {
        if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

// create reply to comment
router.post("/comments/:commentId/replies", auth, async (req, res) => {
    try {
        const Comment = await db.postDb.model("Comment");
        const Post = await db.postDb.model(_modelName);
        const User = await db.userDb.model("User");

        const post = await Post
            .findOne({ _id: req.params.id })
            .populate("creatorId", "", User);
        if (!post) return res.status(404).json({ message: `Post id ${req.params.id} not found.` });

        const owner = await User.findOne({ _id: post.creatorId._id });

        // user must be following owner or owner profile is public or owner is user
        const followed = owner.followers.find(id => id == req.user._id);
        if (owner.visibility != "public" && !followed && post.creatorId._id != req.user._id)
            return res.status(404).json({ message: `Post id ${req.params.id} not found.` });

        const comment = await Comment.findOne({ _id: req.params.commentId });
        if (!comment) return res.status(404).json({ message: `Comment id ${req.params.commentId} not found.` });

        req.body.creatorId = req.user._id;
        req.body.parentCommentId = req.params.commentId;

        const reply = new Comment(req.body);
        await reply.save();

        comment.replies.push(reply._id);
        await comment.save();

        return res.status(200).json({ message: "Success.", data: req.body });
    }
    catch (err) {
        if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

module.exports = router;