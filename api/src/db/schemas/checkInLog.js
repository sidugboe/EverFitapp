const mongoose = require("mongoose");

const itemLogSchema = new mongoose.Schema({
    checkInTemplate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CheckInTemplate"
    },
    creatorId: {
        required: true,
        immutable: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    type: {
        type: String,
        required: true,
        enum: {
            values: ["string", "boolean", "number"],
            message: "Must be 'string', 'boolean', or 'number'"
        }
    },
    value: mongoose.Schema.Types.Mixed,
    date: {
        type: Date,
        default: Date.now,
        immutable: true,
    },
});

module.exports = itemLogSchema;