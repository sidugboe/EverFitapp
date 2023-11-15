const mongoose = require("mongoose");
const { MuscleGroupNames } = require("./muscleGroup");

const workoutLog = new mongoose.Schema({
    workoutTemplate: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "WorkoutTemplate",
    },
    name: {
        type: String,
        required: true,
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    exerciseLogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExerciseLog"
    }],
    muscleGroup: [{
        type: String,
        required: true,
        enum: {
            values: MuscleGroupNames,
            message: `Must be of the following: ${MuscleGroupNames}`
        }
    }],
    description: String,
    attachments: [String],
    access: {
        type: String,
        enum: ["public", "private"],
        default: "private"
    }
});

module.exports = workoutLog;