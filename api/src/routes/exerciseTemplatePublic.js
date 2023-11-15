const router = require("express").Router();
const db = require("../db");

const _modelName = "ExerciseTemplate";

router.get("/", async (req, res) => {
    try {
        const model = await db.exerciseDb.model(_modelName);
        const Muscle = await db.muscleGroupDb.model("Muscle");

        if (!req.query.name) {
            const data = await model.find({ access: "public" }).populate("muscle", "", Muscle);
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
            .populate("muscle", "", Muscle);
        return res.status(200).json(queryEx);
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

module.exports = router;