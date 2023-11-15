const router = require("express").Router();
const { muscleGroupDb } = require("../db");

router.get("/", async (req, res) => {
    const muscleGroup = await muscleGroupDb.model("MuscleGroup");
    const model = await muscleGroupDb.model("Muscle");
    const data = await model.find({}).populate("muscleGroup", "", muscleGroup);
    return res.status(200).json(data);
});

module.exports = router;