const mongoose = require("mongoose");
const postItemSchema = require("./postItem");
const tagValues = require("./postTagValues");

const post = new mongoose.Schema({
    title: {
        required: true,
        type: String,
        maxLength: 100,
        immutable: true
    },
    date: {
        type: Date,
        default: Date.now,
        immutable: true,
    },
    creatorId: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    items: [{
        type: postItemSchema
    }],
    likes: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        select: false
    },
    dislikes: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        select: false,
    },
    comments: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }],
    },
    tags: [{
        type: String,
        enum: {
            values: tagValues,
            message: `Must be of the following: ${tagValues}`
        }
    }],
    __v: { type: Number, select: false }
});

module.exports = post;