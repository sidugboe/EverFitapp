/* EverFit API
 * index.js
 */

// ## dependencies ##

const express = require("express");
const path = require("path");
const morgan = require("morgan");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();

// ## middleware ##

app.disable("x-powered-by");
app.use(express.json());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => res.status(err.statusCode).json({ message: err.toString(), err }));

if (process.env.NODE_ENV === "dev") app.use(morgan("dev"));

app.get("/", (req, res) => res.status(200).json({ message: "Hello world!" }));

app.use("/checkin", require("./routes/checkIn"));
app.use("/exercise/templates", require("./routes/exerciseTemplate"));
app.use("/exercise/logs", require("./routes/exerciseLog"));
app.use("/feed", require("./routes/feed"));
app.use("/messages", require("./routes/message"));
app.use("/muscles", require("./routes/muscle"));
app.use("/musclegroups", require("./routes/muscleGroup"));
app.use("/musclehighlights", require("./routes/muscleHighlight"));
app.use("/notification", require("./routes/notification"));
app.use("/post", require("./routes/post"));
app.use("/profile", require("./routes/profile"));
app.use("/public/exercise/templates", require("./routes/exerciseTemplatePublic"));
app.use("/public/workout/templates", require("./routes/workoutTemplatePublic"));
app.use("/routine", require("./routes/routine"));
app.use("/saves", require("./routes/save"));
app.use("/tag", require("./routes/tag"));
app.use("/upload", require("./routes/imageUpload"));
app.use("/user", require("./routes/user"));
app.use("/workout/templates", require("./routes/workoutTemplate"));
app.use("/workout/logs", require("./routes/workoutLog"));

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}...`));    