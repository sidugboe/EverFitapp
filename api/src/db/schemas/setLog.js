const mongoose = require("mongoose");

const setTemplate = new mongoose.Schema({
    comments: {
        type: String,
        maxLength: 150
    },
    weight: {
        type: Number,
        min: 0
    },
    reps: {
        type: Number,
        min: 1,
        validate: {
            validator: Number.isInteger,
            message: "reps must be an integer."
        }
    },
    type: {
        required: true,
        type: String,
        enum: ["warmup", "working", "drop"]
    },
    restTime: {
        type: Number,
        min: 0
    },
});

module.exports = setTemplate;