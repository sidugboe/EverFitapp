const jwt = require("jsonwebtoken");
const path = require("path");
const devConfig = require("./devConfig");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

module.exports = (req, res, next) => {

    const header = req.headers.authorization;
    const token = header && header.split(" ")[1];

    if (process.env.NODE_ENV === "dev") {
        req.user = devConfig.devUser;
        return next();
    }

    if (!token) {
        return res.status(401).json({ message: "No token provided." });
    }

    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.user = payload;
        next();
    }
    catch (err) {
        if (err.name === "TokenExpiredError") return res.status(401).json({ message: "Token expired." });
        console.error(err);
        return res.status(401).json({ message: "Token not valid." });
    }
};