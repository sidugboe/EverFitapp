const mongoose = require("mongoose");

const rep = new mongoose.Schema({
    name: String,
    emailAddress: String
});

module.exports = rep;