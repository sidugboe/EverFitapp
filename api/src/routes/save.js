const router = require("express").Router();
const auth = require("../auth");
const db = require("../db");

router.get("/routines", auth, async (req, res) => {
    try {
        const User = await db.userDb.model("User");
        const Routine = await db.routineDb.model("Routine");

        const user = await User
            .findOne({ _id: req.user._id })
            .select("+savedRoutines")
            .populate("savedRoutines", "", Routine);
        if (!user || !user.savedRoutines) return res.status(404).json("Routines not found.");

        return res.status(200).json(user.savedRoutines);
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.get("/workouts", auth, async (req, res) => {
    try {
        const User = await db.userDb.model("User");
        const WorkoutTemplate = await db.workoutTemplateDb.model("WorkoutTemplate");

        const user = await User
            .findOne({ _id: req.user._id })
            .select("+savedWorkouts")
            .populate("savedWorkouts", "", WorkoutTemplate);
        if (!user || !user.savedWorkouts) return res.status(404).json("Workouts not found.");

        return res.status(200).json(user.savedWorkouts);
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.get("/exercises", auth, async (req, res) => {
    try {
        const User = await db.userDb.model("User");
        const ExerciseTemplate = await db.exerciseDb.model("ExerciseTemplate");

        const user = await User
            .findOne({ _id: req.user._id })
            .select("+savedExercises")
            .populate("savedExercises", "", ExerciseTemplate);
        if (!user || !user.savedExercises) return res.status(404).json("Exercises not found.");

        return res.status(200).json(user.savedExercises);
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.post("/routines/:routineId", auth, async (req, res) => {
    try {
        const User = await db.userDb.model("User");
        const Routine = await db.routineDb.model("Routine");

        const user = await User
            .findOne({ _id: req.user._id })
            .select("+savedRoutines");
        if (!user) return res.status(404).json("User not found.");

        const routine = await Routine.findOne({ _id: req.params.routineId });

        if (!routine)
            return res.status(404).json("Routines not found.");
        if (routine.creatorId != req.user._id && routine.access != "public")
            return res.status(404).json(`Routine id ${req.params.routineId} not found.`);
        if (!user.savedRoutines)
            user.savedRoutines = [];

        // check list
        const added = user.savedRoutines.indexOf(req.params.routineId);
        if (added > -1) return res.status(200).json({ message: "Success." });

        // add routineId 
        user.savedRoutines.push(routine._id);
        await user.save();

        return res.status(200).json({ message: "Success." });
    }
    catch (err) {
        if (err.name === "CastError") return res.status(404).json({ message: `Routine id ${req.params.routineId} not found.` });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.post("/workouts/:workoutId", auth, async (req, res) => {
    try {
        const User = await db.userDb.model("User");
        const WorkoutTemplate = await db.workoutTemplateDb.model("WorkoutTemplate");

        const user = await User
            .findOne({ _id: req.user._id })
            .select("+savedWorkouts");
        if (!user) return res.status(404).json("User not found.");

        const workout = await WorkoutTemplate.findOne({ _id: req.params.workoutId });

        if (!workout)
            return res.status(404).json("Workout template not found.");
        if (workout.creatorId != req.user._id && workout.access != "public")
            return res.status(404).json(`Workout template id ${req.params.workoutId} not found.`);
        if (!user.savedWorkouts)
            user.savedWorkouts = [];

        // check list
        const added = user.savedWorkouts.indexOf(req.params.workoutId);
        if (added > -1) return res.status(200).json({ message: "Success." });

        // add workoutId 
        user.savedWorkouts.push(workout._id);
        await user.save();

        return res.status(200).json({ message: "Success." });
    }
    catch (err) {
        if (err.name === "CastError") return res.status(404).json({ message: `Workout id ${req.params.workoutId} not found.` });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.post("/exercises/:exerciseId", auth, async (req, res) => {
    try {
        const User = await db.userDb.model("User");
        const ExerciseTemplate = await db.exerciseDb.model("ExerciseTemplate");

        const user = await User
            .findOne({ _id: req.user._id })
            .select("+savedExercises");
        if (!user) return res.status(404).json("User not found.");

        const exercise = await ExerciseTemplate.findOne({ _id: req.params.exerciseId });

        if (!exercise)
            return res.status(404).json("Exercise template not found.");
        if (exercise.creatorId != req.user._id && exercise.access != "public")
            return res.status(404).json(`Exercise template id ${req.params.exerciseId} not found.`);
        if (!user.savedExercises)
            user.savedExercises = [];

        // check list
        const added = user.savedExercises.indexOf(req.params.exerciseId);
        if (added > -1) return res.status(200).json({ message: "Success." });

        // add exerciseId 
        user.savedExercises.push(exercise._id);
        await user.save();

        return res.status(200).json({ message: "Success." });
    }
    catch (err) {
        if (err.name === "CastError") return res.status(404).json({ message: `Exercise id ${req.params.workoutId} not found.` });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.delete("/routines/:routineId", auth, async (req, res) => {
    try {
        const User = await db.userDb.model("User");

        const user = await User
            .findOne({ _id: req.user._id })
            .select("+savedRoutines");
        if (!user) return res.status(404).json("User not found.");

        if (!user.savedRoutines) user.savedRoutines = [];

        // check if added
        const index = user.savedRoutines.indexOf(req.params.routineId);
        if (index < 0) return res.status(200).json({ message: "Success." });

        // remove from added
        user.savedRoutines.splice(index, 1);
        await user.save();

        return res.status(200).json({ message: "Success." });
    }
    catch (err) {
        if (err.name === "CastError") return res.status(404).json({ message: `Routine id ${req.params.routineId} not found.` });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.delete("/workouts/:workoutId", auth, async (req, res) => {
    try {
        const User = await db.userDb.model("User");

        const user = await User
            .findOne({ _id: req.user._id })
            .select("+savedWorkouts");
        if (!user) return res.status(404).json("User not found.");

        if (!user.savedWorkouts) user.savedWorkouts = [];

        // check if added
        const index = user.savedWorkouts.indexOf(req.params.workoutId);
        if (index < 0) return res.status(200).json({ message: "Success." });

        // remove from added
        user.savedWorkouts.splice(index, 1);
        await user.save();

        return res.status(200).json({ message: "Success." });
    }
    catch (err) {
        if (err.name === "CastError") return res.status(404).json({ message: `Workout id ${req.params.workoutId} not found.` });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.delete("/exercises/:exerciseId", auth, async (req, res) => {
    try {
        const User = await db.userDb.model("User");

        const user = await User
            .findOne({ _id: req.user._id })
            .select("+savedExercises");
        if (!user) return res.status(404).json("User not found.");

        if (!user.savedExercises) user.savedExercises = [];

        // check if added
        const index = user.savedExercises.indexOf(req.params.exerciseId);
        if (index < 0) return res.status(200).json({ message: "Success." });

        // remove from added
        user.savedExercises.splice(index, 1);
        await user.save();

        return res.status(200).json({ message: "Success." });
    }
    catch (err) {
        if (err.name === "CastError") return res.status(404).json({ message: `Exercise id ${req.params.exerciseId} not found.` });
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

module.exports = router;