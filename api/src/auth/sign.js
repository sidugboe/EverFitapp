const jwt = require("jsonwebtoken");
const expiryTime = "365d";

module.exports = payload => {
    payload.password = undefined;
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: expiryTime });
};