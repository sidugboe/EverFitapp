const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
        maxLength: 100
    },
    creatorId: {
        required: true,
        immutable: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    access: {
        type: String,
        enum: {
            message: "Must be ['public', 'private'].",
            values: ["public", "private"]
        },
        default: "private"
    },
    type: {
        type: String,
        required: true,
        enum: {
            values: ["string", "boolean", "number"],
            message: "Must be 'string', 'boolean', or 'number'"
        }
    },
    units: {
        type: String
    },
});

module.exports = itemSchema;