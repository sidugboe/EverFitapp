const mongoose = require("mongoose");
const { MuscleGroupNames } = require("./muscleGroup");

const workoutTemplate = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    exerciseTemplates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExerciseTemplate"
    }],
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    muscleGroup: [{
        type: String,
        required: true,
        enum: {
            values: MuscleGroupNames,
            message: `Must be of the following: ${MuscleGroupNames}`
        }
    }],
    description: String,
    type: {
        type: String
    },
    attachments: [String],
    access: {
        type: String,
        enum: ["public", "unlisted", "private"],
        default: "private"
    },
    likes: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
    },
    textColor: {
        type: String,
        enum: ["white", "gray", "black"],
        default: "black"
    }
});

module.exports = workoutTemplate;