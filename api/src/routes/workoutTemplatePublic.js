const router = require("express").Router();
const db = require("../db");

const _modelName = "WorkoutTemplate";

router.get("/", async (req, res) => {
    try {
        const model = await db.workoutTemplateDb.model(_modelName);
        const Exercise = await db.exerciseDb.model("ExerciseTemplate");
        const User = await db.userDb.model("User");

        if (!req.query.name) {
            const data = await model.find({ access: "public" })
                .populate("exerciseTemplates", "", Exercise)
                .populate("creatorId", "name username profilePicURL", User);
            return res.status(200).json(data);
        }

        // search for matches on start of 'name'
        const queryEx = await model.find(
            {
                name: {
                    $regex: `^${req.query.name.toLowerCase()}`,
                    $options: "i"
                },
                access: "public"
            })
            .populate("exerciseTemplates", "", Exercise)
            .populate("creatorId", "name username profilePicURL", User);
        return res.status(200).json(queryEx);
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

module.exports = router;