const mongoose = require("mongoose");

const measurementVals = ["lbs ft", "kg m"];

const measurementSchema = new mongoose.Schema({
    units: {
        type: String,
        enum: {
            values: measurementVals,
            message: `Must be ${measurementVals}`
        },
        default: measurementVals[0]
    },
    weight: {
        type: Number
    },
    height: {
        type: Number,
        validate: {
            validator: Number.isInteger,
            message: "Height must be integer"
        }
    },
    visibility: {
        type: String,
        enum: ["public", "private"],
        default: "private"
    }
});

const user = new mongoose.Schema({
    name: {
        type: String,
        maxLength: 50
    },
    username: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: [true, "Username is already in use."]
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: [true, "Email is already in use."]
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    biography: {
        type: String,
        maxLength: 200
    },
    profilePicURL: String,
    measurements: {
        type: measurementSchema,
        select: false
    },
    visibility: {
        type: String,
        enum: ["public", "private"],
        default: "public"
    },
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    activeRoutine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Routine"
    },
    savedRoutines: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Routine"
        }],
        select: false,
    },
    savedWorkouts: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "WorkoutTemplate"
        }],
        select: false,
    },
    savedExercises: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "ExerciseTemplate"
        }],
        select: false,
    },
    __v: { type: Number, select: false }
});

module.exports = user;