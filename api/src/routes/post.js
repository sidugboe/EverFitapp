const router = require("express").Router();
const auth = require("../auth");
const db = require("../db");
const interactRouter = require("./postInteract");
const likeCount = require("../utils/likeCount");
const dateCompare = require("../utils/dateCompare");
const dislikeCheck = require("../utils/dislikeCheck");
const tagValues = require("../db/schemas/postTagValues");

const _modelName = "Post";

router.use("/id/:id", interactRouter);

// get own posts
router.get("/", auth, async (req, res) => {
    try {
        const Post = await db.postDb.model(_modelName);
        const User = await db.userDb.model("User");

        const data = await Post
            .find({ creatorId: req.user._id })
            .select("+likes +dislikes")
            .populate("creatorId", "name username profilePicURL", User)
            .lean();
        data.map(likeCount);

        return res.status(200).json(data.sort(dateCompare));
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

// get a post by id
router.get("/id/:id", auth, async (req, res) => {
    try {
        const Post = await db.postDb.model(_modelName);

        const Comment = await db.postDb.model("Comment");
        const ExerciseLog = await db.exerciseDb.model("ExerciseTemplate");
        const ExerciseTemplate = await db.exerciseDb.model("ExerciseTemplate");
        const Routine = await db.routineDb.model("Routine");
        const User = await db.userDb.model("User");
        const WorkoutLog = await db.workoutTemplateDb.model("WorkoutLog");
        const WorkoutTemplate = await db.workoutTemplateDb.model("WorkoutTemplate");

        let post = await Post
            .findOne({ _id: req.params.id })
            .select("+likes +dislikes")
            .populate("creatorId", "name username profilePicURL", User)
            .populate("likes", "name username profilePicURL", User)
            .populate("dislikes", "name username profilePicURL", User)
            .populate({
                path: "comments",
                model: Comment,
                populate: {
                    path: "creatorId",
                    select: "name username profilePicURL",
                    model: User
                }
            })
            .populate("items.exerciseLogs", "", ExerciseLog)
            .populate("items.exerciseTemplates", "", ExerciseTemplate)
            .populate({
                path: "items",
                populate: {
                    path: "workoutLogs",
                    model: WorkoutLog,
                    populate: {
                        path: "exerciseLogs",
                        model: ExerciseLog,
                    }
                }
            })
            .populate({
                path: "items",
                populate: {
                    path: "workoutTemplates",
                    model: WorkoutTemplate,
                    populate: {
                        path: "exerciseTemplates",
                        model: ExerciseTemplate,
                    }
                }
            })
            .populate({
                path: "items",
                populate: {
                    path: "routines",
                    model: Routine,
                    populate: {
                        path: "workoutTemplates",
                        model: WorkoutTemplate,
                        populate: {
                            path: "exerciseTemplates",
                            model: ExerciseTemplate
                        }
                    }
                }
            })
            .lean();
        if (!post) return res.status(404).json({ message: `Post id ${req.params.id} not found.` });

        post = dislikeCheck(post, req.user);

        // post belongs to user
        if (post.creatorId._id == req.user._id) return res.status(200).json(post);

        // post is public
        const owner = await User.findOne({ _id: post.creatorId._id });
        if (owner.visibility == "public") return res.status(200).json(post);

        // post is being viewed by follower
        const followed = owner.followers.find(id => id == req.user._id);
        if (!followed) return res.status(404).json({ message: `Post id ${req.params.id} not found.` });

        return res.status(200).json(post);
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.get("/user/:id", auth, async (req, res) => {
    try {
        const Post = await db.postDb.model(_modelName);
        const User = await db.userDb.model("User");

        const user = await User.findOne({ _id: req.params.id });
        if (!user) return res.status(404).json({ message: `User id ${req.params.id} not found.` });

        const posts = await Post
            .find({ creatorId: req.params.id })
            .select("+likes +dislikes")
            .populate("creatorId", "name username profilePicURL", User)
            .lean();
        if (!posts) return res.status(404).json({ message: `User id ${req.params.id} not found.` });
        posts.map(likeCount);

        if (req.params.id == req.user._id) return res.status(200).json(posts);

        // user is public
        if (user.visibility == "public") return res.status(200).json(posts);

        // post is being viewed by follower
        const followed = user.followers.find(id => id == req.user._id);
        if (!followed) return res.status(404).json({ message: `User id ${req.params.id} not found.` });

        return res.status(200).json(posts);
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

// get all tags
router.get("/tags", async (req, res) => {
    try {
        return res.status(200).json(tagValues);
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.post("/", auth, async (req, res) => {
    try {
        const Post = await db.postDb.model(_modelName);

        req.body.creatorId = req.user._id;
        delete req.body.likes;
        delete req.body.dislikes;

        const post = new Post(req.body);
        const data = await post.save();
        return res.status(200).json({ message: "Success.", data });
    }
    catch (err) {
        if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.put("/", auth, async (req, res) => {
    try {
        const Post = await db.postDb.model(_modelName);

        req.body.creatorId = req.user._id;
        req.body.tags = [...new Set(req.body.tags)]; // remove duplicates
        delete req.body.likes;
        delete req.body.dislikes;

        const post = await Post.findOneAndUpdate(
            { _id: req.body._id, creatorId: req.user._id },
            req.body,
            { new: true, runValidators: true });
        if (!post) return res.status(404).json({ message: `Post id ${req.body._id} does not exist.` });

        return res.status(201).json({ message: "Success.", data: post });
    }
    catch (err) {
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid id." });
        if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.delete("/id/:id", auth, async (req, res) => {
    try {
        const Post = await db.postDb.model(_modelName);

        const post = await Post.findOne({ _id: req.params.id, creatorId: req.user._id });
        if (!post) return res.status(404).json({ message: `Post id ${req.params.id} not found.` });

        await Post.deleteOne({ _id: req.params.id, creatorId: req.user._id });
        return res.status(200).json({ message: "Success." });
    }
    catch (err) {
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid id." });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

module.exports = router;