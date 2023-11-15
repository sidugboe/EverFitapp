const router = require("express").Router();
const db = require("../db");
const auth = require("../auth");
const followRouter = require("./follow");

router.use("/", followRouter);

// returns the most in descending most followed public users 
router.get("/popular", auth, async (req, res) => {
    try {
        const User = await db.userDb.model("User");

        const data = await User
            .aggregate([
                { // match public
                    $match: {
                        visibility: { $eq: "public" }
                    }
                },
                { // count followers
                    $project: {
                        _id: 1,
                        name: 1,
                        username: 1,
                        visibility: 1,
                        profilePicURL: 1,
                        followerCount: { $size: "$followers" }
                    }
                },
                { // sort descending
                    $sort: { followerCount: -1 }
                }
            ]);

        if (!data) return res.status(404).json({ message: "Popular not found." });

        return res.status(200).json(data);
    }
    catch (err) {
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid request." });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.get("/id/:id", auth, async (req, res) => { //this route gets a different user with a specified username
    try {
        const User = await db.userDb.model("User");
        const Routine = await db.routineDb.model("Routine");

        const user = await User
            .findOne({ _id: req.params.id })
            .select("-email +measurements")
            .populate("following", "name username profilePicURL")
            .populate("followers", "name username profilePicURL")
            .populate("activeRoutine", "", Routine)
            .lean();

        if (!user) return res.status(404).json({ message: `User ${req.params.id} not found.` });

        if (user._id == req.user._id) return res.status(200).json(user);

        if (user.measurements?.visibility == "private") delete user.measurements;

        // user is public
        if (user.visibility == "public") return res.status(200).json(user);

        // post is being viewed by follower
        const followed = user.followers.find(u => u._id == req.user._id);
        if (!followed) {
            delete user.following;
            delete user.followers;
            delete user.activeRoutine;
            return res.status(200).json(user);
        }

        if (!user) return res.status(404).json({ message: `User "${req.params.id}" not found.` });

        return res.status(200).json(user);
    }
    catch (err) {
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid user id." });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.get("/u/:username", auth, async (req, res) => { //this route gets a different user with a specified username
    try {
        const User = await db.userDb.model("User");
        const Routine = await db.routineDb.model("Routine");

        const user = await User
            .findOne({ username: req.params.username })
            .select("-email +measurements")
            .populate("following", "name username profilePicURL")
            .populate("followers", "name username profilePicURL")
            .populate("activeRoutine", "", Routine)
            .lean();

        if (!user) return res.status(404).json({ message: `User ${req.params.username} not found.` });

        if (user._id == req.user._id) return res.status(200).json(user);

        if (user.measurements?.visibility == "private") delete user.measurements;

        // user is public
        if (user.visibility == "public") return res.status(200).json(user);

        // post is being viewed by follower
        const followed = user.followers.find(id => id == req.user._id);
        if (!followed) {
            delete user.following;
            delete user.followers;
            delete user.activeRoutine;
            return res.status(200).json(user);
        }

        if (!user) return res.status(404).json({ message: `User "${req.params.username}" not found.` });

        return res.status(200).json(user);
    }
    catch (err) {
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid username." });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.get("/", auth, async (req, res) => { //this route gets the current user
    try {
        const User = await db.userDb.model("User");
        const Routine = await db.routineDb.model("Routine");
        const WorkoutTemplate = await db.workoutTemplateDb.model("WorkoutTemplate");
        const ExerciseTemplate = await db.exerciseDb.model("ExerciseTemplate");

        const data = await User
            .findOne({ _id: req.user._id })
            .select("+savedRoutines +savedWorkouts +savedExercises")
            .populate("savedRoutines", "", Routine)
            .populate("savedRoutines", "", WorkoutTemplate)
            .populate("savedWorkouts", "", ExerciseTemplate)
            .populate("following", "name username profilePicURL")
            .populate("followers", "name username profilePicURL")
            .populate("activeRoutine", "", Routine);
        return res.status(200).json(data);
    }
    catch (err) {
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid username." });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.put("/", auth, async (req, res) => { //this route edits an existing user, finding it through its associated email
    try {
        const User = await db.userDb.model("User");

        delete req.body._id;
        delete req.body.followers;
        delete req.body.followers;
        delete req.body.password;

        const user = await User.findOneAndUpdate({ email: req.user.email }, req.body, { new: true });
        if (!user) return res.status(400).json({ message: "User does not exist." });

        return res.status(201).json({ message: "Success.", data: user });
    }
    catch (err) {
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid id." });
        if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.delete("/", auth, async (req, res) => {
    try {
        const User = await db.userDb.model("User");

        const user = await User.findOne({ _id: req.user._id });
        if (!user) return res.status(404).json({ message: `User "${req.params.id}" not found.` });

        await User.deleteOne({ _id: req.user._id });
        return res.status(200).json({ message: "Success." });
    }
    catch (err) {
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid request." });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

module.exports = router;