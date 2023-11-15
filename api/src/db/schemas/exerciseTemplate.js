const mongoose = require("mongoose");
const { MuscleGroupNames } = require("./muscleGroup");
const { MuscleHighlightNames } = require("./muscleHighlight");
const setTemplateSchema = require("./setTemplate");

const exerciseTemplate = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: [true, "Exercise already exists."],
        lowercase: true,
    },
    creatorId: {
        type: String,
        required: true,
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
        enum: ["public", "private", "unlisted"],
        default: "private"
    },
    likes: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
    },
    sets: [{
        type: setTemplateSchema
    }]
});

module.exports = exerciseTemplate;