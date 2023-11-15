const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    creatorId: {
        required: true,
        immutable: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    recipientId: {
        required: true,
        immutable: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    date: {
        type: Date,
        default: Date.now,
        immutable: true,
    },
    type: {
        required: true,
        type: String,
        enum: ["routine", "exerciseLog", "workoutLog", "exercise", "workout", "text"]
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
    __v: { type: Number, select: false }
});

module.exports = messageSchema;