const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

/**
 * Connect to DB
 * @param {String} db_uri 
 * @returns {mongoose.Connection}
 */
const connect = (db_uri) => {
    try {
        const conn = mongoose.createConnection(db_uri);
        console.log("[Success] Connected to MongoDB");
        return conn;
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

const dbName = {
    CheckIn: `${process.env.DB_URI}CheckIn?retryWrites=true&w=majority`,
    ExerciseTemplate: `${process.env.DB_URI}Exercise?retryWrites=true&w=majority`,
    Message: `${process.env.DB_URI}Message?retryWrites=true&w=majority`,
    MuscleGroup: `${process.env.DB_URI}MuscleGroup?retryWrites=true&w=majority`,
    Post: `${process.env.DB_URI}Post?retryWrites=true&w=majority`,
    Routine: `${process.env.DB_URI}Routine?retryWrites=true&w=majority`,
    User: `${process.env.DB_URI}User?retryWrites=true&w=majority`,
    WorkoutTemplate: `${process.env.DB_URI}Workout?retryWrites=true&w=majority`,
};

module.exports = {
    connect,
    dbName
};