const mongoose = require("mongoose");

const MuscleGroups = [
    {
        group: "arms"
    },
    {
        group: "back"
    },
    {
        group: "chest"
    },
    {
        group: "core"
    },
    {
        group: "hip"
    },
    {
        group: "legs"
    },
    {
        group: "shoulder"
    },
];

const MuscleGroupNames = ["chest", "back", "core", "shoulder", "arms", "hip", "legs"];

const MuscleGroupSchema = new mongoose.Schema({
    group: {
        type: String,
        enum: MuscleGroupNames,
        required: true
    }
});

module.exports = {
    MuscleGroups,
    MuscleGroupSchema,
    MuscleGroupNames
};