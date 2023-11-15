const mongoose = require("mongoose");

const user = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        immutable: true,
    },
    events: [{
        type: String
    }],
});

module.exports = user;