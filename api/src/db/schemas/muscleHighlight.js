const mongoose = require("mongoose");

const MuscleHighlights = [
    {
        highlight: "chest",
        muscleGroup: "63cc790d9425503a5dc4a18a"
    },
    {
        highlight: "trapezius",
        muscleGroup: "63cc790d9425503a5dc4a188"
    },
    {
        highlight: "upper-back",
        muscleGroup: "63cc790d9425503a5dc4a188"
    },
    {
        highlight: "biceps",
        muscleGroup: "63cc790d9425503a5dc4a186"
    },
    {
        highlight: "triceps",
        muscleGroup: "63cc790d9425503a5dc4a186"
    },
    {
        highlight: "forearm",
        muscleGroup: "63cc790d9425503a5dc4a186"
    },
    {
        highlight: "back-deltoids",
        muscleGroup: "63cc790d9425503a5dc4a192"
    },
    {
        highlight: "front-deltoids",
        muscleGroup: "63cc790d9425503a5dc4a192"
    },
    {
        highlight: "head",
        muscleGroup: "63cc790d9425503a5dc4a192"
    },
    {
        highlight: "neck",
        muscleGroup: "63cc790d9425503a5dc4a192"
    },
    {
        highlight: "abs",
        muscleGroup: "63cc790d9425503a5dc4a18c"
    },
    {
        highlight: "obliques",
        muscleGroup: "63cc790d9425503a5dc4a18c"
    },
    {
        highlight: "lower-back",
        muscleGroup: "63cc790d9425503a5dc4a18c"
    },
    {
        highlight: "adductor",
        muscleGroup: "63cc790d9425503a5dc4a18e"
    },
    {
        highlight: "abductors",
        muscleGroup: "63cc790d9425503a5dc4a18e"
    },
    {
        highlight: "gluteal",
        muscleGroup: "63cc790d9425503a5dc4a18e"
    },
    {
        highlight: "quadriceps",
        muscleGroup: "63cc790d9425503a5dc4a190"
    },
    {
        highlight: "hamstring",
        muscleGroup: "63cc790d9425503a5dc4a190"
    },
    {
        highlight: "calves",
        muscleGroup: "63cc790d9425503a5dc4a190"
    },
];

const MuscleHighlightNames = ["chest", "trapezius", "upper-back", "biceps", "triceps", "forearm", "back-deltoids", "front-deltoids", "head", "neck", "abs", "obliques", "lower-back", "adductor", "abductors", "gluteal", "quadriceps", "hamstring", "calves"];

const MuscleHighlightSchema = new mongoose.Schema({
    highlight: {
        type: String,
        required: true,
        unique: true,
        enum: ["chest", "trapezius", "upper-back", "biceps", "triceps", "forearm", "back-deltoids", "front-deltoids", "head", "neck", "abs", "obliques", "lower-back", "adductor", "abductors", "gluteal", "quadriceps", "hamstring", "calves"]
    },
    muscleGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MuscleGroup",
        required: true
    }
});

module.exports = {
    MuscleHighlights,
    MuscleHighlightSchema,
    MuscleHighlightNames
};