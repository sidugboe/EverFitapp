const bcrypt = require("bcrypt");
const router = require("express").Router();
const { userDb } = require("../db");
const signToken = require("../auth/sign");
const auth = require("../auth");
const exerciseRouter = require("./userExercises");
const workoutRouter = require("./userWorkouts");

const saltWork = 10;

router.use("/id/:id/exercise", exerciseRouter);

router.use("/id/:id/workout", workoutRouter);

router.post("/login", async (req, res) => {
    try {
        const User = await userDb.model("User");
        const { username, password } = req.body;

        const user = await User.findOne({ username })
            .select("+password -followers -following -activeRoutine -biography");
        if (!user) return res.status(401).json({ message: "Invalid credentials." });

        const result = bcrypt.compareSync(password, user.password);
        if (!result) return res.status(401).json({ message: "Invalid credentials." });

        const token = signToken(user.toObject());

        return res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error." });
    }
});

router.post("/signup", async (req, res) => {
    try {
        const User = await userDb.model("User");
        const { username, email } = req.body;

        const u1 = await User.findOne({ username });
        if (u1) return res.status(400).json({ message: "Username already in use." });
        const u2 = await User.findOne({ email });
        if (u2) return res.status(400).json({ message: "Email already in use." });

        if (!req.body.password) return res.status(400).json({ message: "Password is required." });
        req.body.password = await bcrypt.hash(req.body.password, bcrypt.genSaltSync(saltWork));

        const user = new User(req.body);
        const data = await user.save();

        const token = signToken(data.toObject());

        return res.status(200).json({ message: "Success.", token });
    } catch (err) {
        if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.get("/whoami", auth, async (req, res) => {
    try {
        const User = await userDb.model("User");

        const user = await User.findOne({ _id: req.user._id });

        if (!user) return res.status(404).json({ message: `User id ${req.user._id} not found.` });

        return res.status(200).json(user);
    }
    catch (err) {
        if (err.name === "CastError") return res.status(404).json({ message: `User id ${req.user._id} not found.` });
        if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.get("/id/:id", auth, async (req, res) => {
    try {
        const User = await userDb.model("User");

        const user = await User
            .findOne({ _id: req.params.id })
            .select("-email -biography -profilePicURL -measurements -visibility -followers -following -activeRoutine")
            .lean();

        if (!user) return res.status(404).json({ message: `User id ${req.params.id} not found.` });
        if (req.params.id == req.user._id) return res.status(200).json(user);

        return res.status(200).json(user);
    }
    catch (err) {
        if (err.name === "CastError") return res.status(404).json({ message: `User id ${req.params.id} not found.` });
        if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.get("/search/:name", auth, async (req, res) => {
    try {
        const User = await userDb.model("User");

        const users = await User
            .find({
                $or: [
                    {
                        name: {
                            $regex: `^${req.params.name.toLowerCase()}`,
                            $options: "i"
                        }
                    },
                    {
                        username: {
                            $regex: `^${req.params.name.toLowerCase()}`,
                            $options: "i"
                        }
                    }
                ]
            })
            .select("-email -biography -visibility -followers -following -activeRoutine");

        return res.status(200).json(users);
    }
    catch (err) {
        if (err.name === "CastError") return res.status(404).json({ message: `User id ${req.params.id} not found.` });
        if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

module.exports = router;