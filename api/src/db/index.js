const { connect, dbName } = require("./config");

const checkInDb = connect(dbName.CheckIn);
const exerciseDb = connect(dbName.ExerciseTemplate);
const messageDb = connect(dbName.Message);
const muscleGroupDb = connect(dbName.MuscleGroup);
const routineDb = connect(dbName.Routine);
const userDb = connect(dbName.User);
const workoutTemplateDb = connect(dbName.WorkoutTemplate);
const postDb = connect(dbName.Post);

userDb.model("User", require("./schemas/user"));

checkInDb.model("CheckInTemplate", require("./schemas/checkInTemplate"));
checkInDb.model("CheckInLog", require("./schemas/checkInLog"));

exerciseDb.model("ExerciseTemplate", require("./schemas/exerciseTemplate"));
exerciseDb.model("ExerciseLog", require("./schemas/exerciseLog"));
exerciseDb.model("SetTemplate", require("./schemas/setTemplate"));
exerciseDb.model("SetLog", require("./schemas/setLog"));

messageDb.model("Message", require("./schemas/message"));

muscleGroupDb.model("MuscleGroup", require("./schemas/muscleGroup").MuscleGroupSchema);
muscleGroupDb.model("MuscleHighlight", require("./schemas/muscleHighlight").MuscleHighlightSchema);
muscleGroupDb.model("Muscle", require("./schemas/muscle").MuscleSchema);

postDb.model("Post", require("./schemas/post"));
postDb.model("PostItem", require("./schemas/postItem"));
postDb.model("Comment", require("./schemas/comment"));

routineDb.model("Routine", require("./schemas/routine"));

workoutTemplateDb.model("WorkoutTemplate", require("./schemas/workoutTemplate"));
workoutTemplateDb.model("WorkoutLog", require("./schemas/workoutLog"));

userDb.model("User", require("./schemas/user"));
userDb.model("Notification", require("./schemas/notification"));

module.exports = {
    checkInDb,
    exerciseDb,
    messageDb,
    muscleGroupDb,
    postDb,
    routineDb,
    userDb,
    workoutTemplateDb
};