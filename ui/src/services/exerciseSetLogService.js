import React, { useContext, useState, useEffect, useRef } from "react";

const useExerciseSetLogs = (exerciseId) => {
    const [exerciseSetLogs, setExerciseSetLogs] = useState([]);

    useEffect(() => {
        refetchExerciseSetLogs();
    }, []);

    const refetchExerciseSetLogs = () => {
        // fetch('http://3.138.86.29/exercise/templates')
        //     .then((response) => response.json())
        //     .then((data) => {
        //         if(data)
        //             setExcersies(data);
        //         else
        //             setExcersies([]);
        //     });

        // todo filter ExerciseSetLogs is 'exerciseId' is passed in, otherwise provide the whole list
        
        // local test data
        let dummyExerciseSetLogs = [{
            _id: "exercise-set-log-id-1",
            exerciseId: "exercise-id-1",
            exerciseSetId: "exercise-set-id-1",
            weightKg: 50,
            weightLb: 112.5,
            reps: 9,
            restTime: 30,
            type: "warmup",
            notes: "second warmup approaching about 70% of top working set for only few reps",
            setNo: 1
        },
        {
            _id: "exercise-set-log-id-2",
            exerciseId: "exercise-id-1",
            exerciseSetId: "exercise-set-id-2",
            weightKg: 100,
            weightLb: 225,
            reps: 8,
            restTime: 120,
            type: "working",
            notes: "top set taken to failure with weight aimed to be progressed",
            setNo: 2
        },
        {
            _id: "exercise-set-log-id-3",
            exerciseId: "exercise-id-1",
            exerciseSetId: "exercise-set-id-3",
            weightKg: 100,
            weightLb: 225,
            reps: 6,
            restTime: 120,
            type: "backoff",
            notes: "any additional information here",
            setNo: 3
        }]
        setExerciseSetLogs(dummyExerciseSetLogs);
    }

    const createExerciseSetLog = (newExerciseSetLog) => {
        // fetch POST here
    }

    const editExerciseSetLog = (exerciseSetLog) => {

        // todo implement

        // not implemented
        // fetch('http://3.138.86.29/exerciseset/templates',{
        //     method:'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(dbObj)
        // })
        //     .then((response) => response.text())
    }

    return {
        exerciseSetLogs,
        createExerciseSetLog,
        refetchExerciseSetLogs,
        editExerciseSetLog
    }
}

export { useExerciseSetLogs };

// implement in component by doing
// const { exercises, createExercise /* + other methods */ } = useExercises();