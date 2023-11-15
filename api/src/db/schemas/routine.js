const mongoose = require("mongoose");
// const { MuscleGroupNames } = require("./muscleGroup");
// const { MuscleHighlightNames } = require("./muscleHighlight");

const routineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: [true, "Routine already exists."],
        lowercase: true,
    },
    workoutTemplates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "WorkoutTemplate"
    }],
    numberOfDays: {
        type: Number,
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    description: String,
    attachments: [String],
    textColor: {
        type: String,
        enum: ["white", "gray", "black"],
        default: "black"
    },
    access: {
        type: String,
        enum: ["public", "private"],
        default: "private"
    },
    likes: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
    },
});

module.exports = routineSchema;