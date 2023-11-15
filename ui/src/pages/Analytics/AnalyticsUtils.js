/**
 * This file contains vanilla JS functions that are helpful for procesing
 * user log data to generate analytics
 */

// For Frequency Analytics
const isWithinLastXDays = (numDays, dateString) => {
    const THIRTY_DAYS_IN_MILLIS = numDays * 24 * 60 * 60 * 1000;
    const millisDiff = Date.now() - (new Date(dateString)).getTime();
    return(millisDiff <= THIRTY_DAYS_IN_MILLIS);
}

const diagramMap = new Map([
    ['arms', ['biceps','triceps','forearm']],
    ['back', ['trapezius', 'upper-back', 'lower-back']],
    ['chest', ['chest']],
    ['core', ['abs', 'obliques']],
    ['hip', ['adductor', 'abductors']],
    ['legs', ['hamstring', 'quadriceps', 'calves', 'gluteal']],
    ['shoulder', ['back-deltoids', 'front-deltoids']]
]);

// For Personal Records
const getOverallExerciseData = (arr) => { //returns 
    let exFreq = new Map();
    let currentMax = 0;
    let currentMaxName = ""
    arr?.forEach((element) => {
        if(exFreq.has(element.name))
            exFreq.set(element.name, exFreq.get(element.name)+1);
        else
            exFreq.set(element.name, 1);
        if(exFreq.get(element.name) > currentMax){
            currentMax = exFreq.get(element.name)
            currentMaxName = element.name;
        }
    });
    return({ 
        uniqueExercises: exFreq.size,  
        mostCommon: currentMaxName
    })
}

const maxRepPerExerciseLog = (exerciseLog) => {
    let maxRep = -1;
    if(exerciseLog.sets == null)
        return 0;

    for(let i=0 ; i<exerciseLog.sets.length ; i++){
        if(exerciseLog.sets[i] == null)
            continue
        else if (exerciseLog.sets[i].weight > maxRep && exerciseLog.sets[i].reps > 0)
            maxRep = exerciseLog.sets[i].weight
    }
    return maxRep;
}

export { isWithinLastXDays, diagramMap, getOverallExerciseData, maxRepPerExerciseLog }