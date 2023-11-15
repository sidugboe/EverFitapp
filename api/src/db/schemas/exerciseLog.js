const mongoose = require("mongoose");
const { MuscleGroupNames } = require("./muscleGroup");
const { MuscleHighlightNames } = require("./muscleHighlight");
const setLogSchema = require("./setLog");

const exerciseLog = new mongoose.Schema({
    exerciseTemplate: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExerciseTemplate",
    },
    name: {
        type: String,
        required: true,
        lowercase: true,
    },
    creatorId: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
        immutable: true,
    },
    muscle: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Muscle",
    }],
    muscleHighlight: [{
        type: String,
        enum: {
            values: MuscleHighlightNames,
            message: `Must be of the following: ${MuscleHighlightNames}`
        }
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
    type: {
        type: String,
        enum: ["Lift", "Cardio", "Mobility"]
    },
    attachments: [String],
    access: {
        type: String,
        enum: ["public", "private"],
        default: "private"
    },
    sets: [{
        type: setLogSchema
    }]
});

module.exports = exerciseLog;