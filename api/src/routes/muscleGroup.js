const router = require("express").Router();
const { muscleGroupDb } = require("../db");

router.get("/", async (req, res) => {
    const model = await muscleGroupDb.model("MuscleGroup");
    const data = await model.find({});
    return res.status(200).json(data);
});

module.exports = router;