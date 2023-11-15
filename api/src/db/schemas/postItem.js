const mongoose = require("mongoose");

const item = new mongoose.Schema({
    type: {
        required: true,
        type: String,
        enum: ["routine", "exerciseLog", "workoutLog", "checkInLog", "exercise", "workout", "media", "text"]
    },
    text: {
        type: String,
        maxLength: 1000
    },
    exerciseLogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExerciseLog"
    }],
    exerciseTemplates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExerciseTemplate"
    }],
    workoutLogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "WorkoutLog"
    }],
    workoutTemplates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "WorkoutTemplate"
    }],
    routines: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Routine"
    }],
    media: {
        type: String,
        maxLength: 200
    },
    __v: { type: Number, select: false }
});

module.exports = item;