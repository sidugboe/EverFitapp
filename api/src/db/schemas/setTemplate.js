const mongoose = require("mongoose");

const setLog = new mongoose.Schema({
    comments: {
        type: String,
        maxLength: 150
    },
    type: {
        required: true,
        type: String,
        enum: ["warmup", "working", "drop"]
    }
});

module.exports = setLog;