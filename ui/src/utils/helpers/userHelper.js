
/**
 * 
 * @param {*} routine 
 * @param {*} workoutLogs 
 * @returns {object} object continaing the next workout to be done in the split and the day of that workout
 */
const getCurrentWorkoutInRoutine = (routine, workoutLogs) => {
    let workoutLogsUnderActiveRoutine = workoutLogs.filter(workout => workout?.routine)
    for(let workoutLog of workoutLogs){ 

    }
}