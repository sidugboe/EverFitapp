const mongoose = require("mongoose");

const comment = new mongoose.Schema({
    creatorId: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        immutable: true
    },
    date: {
        type: Date,
        default: Date.now,
        immutable: true,
    },
    text: {
        required: true,
        type: String,
        maxLength: 1000
    },
    replies: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }],
    }
});

module.exports = comment;