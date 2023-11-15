import React, { useContext, useState, useEffect, useRef } from "react";

const useExerciseSets = (exerciseId) => {
    const [exerciseSets, setExerciseSets] = useState([]);

    useEffect(() => {
        refetchExerciseSets();
    }, []);

    const refetchExerciseSets = () => {
        // fetch('http://3.138.86.29/exercise/templates')
        //     .then((response) => response.json())
        //     .then((data) => {
        //         if(data)
        //             setExcersies(data);
        //         else
        //             setExcersies([]);
        //     });

        // todo filter exerciseSets is 'exerciseId' is passed in, otherwise provide the whole list

        // local test data
        let dummyExerciseSets = [{
            _id: "exercise-set-id-1",
            type: "warmup",
            notes: "second warmup approaching about 70% of top working set for only few reps",
            exerciseId: "exercise-id-1",
        },
        {
            _id: "exercise-set-id-2",
            type: "working",
            notes: "top set taken to failure with weight aimed to be progressed",
            exerciseId: "exercise-id-1",
        },
        {
            _id: "exercise-set-id-3",
            type: "backoff",
            notes: "any additional information here",
            exerciseId: "exercise-id-1",
        }];
        
        setExerciseSets(dummyExerciseSets);
    }

    const createExerciseSet = (newExerciseSet) => {
        // fetch POST here
    }

    const editExerciseSet = (exerciseSet) => {

        const dbObj = {
            _id: exercise._id,
            name: exercise.name,
            creatorId: exercise.creatorId,
            muscle: [],
            muscleArea: [],
            muscleGroup: exercise?.muscle,
            description: exercise?.description,
            attachements: exercise?.description,
        }

        // not implemented
        // fetch('http://3.138.86.29/exerciseset/templates',{
        //     method:'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(dbObj)
        // })
        //     .then((response) => response.text())
    }

    return {
        exerciseSets,
        createExerciseSet,
        refetchExerciseSets,
        editExerciseSet
    }
}

export { useExerciseSets };

// implement in component by doing
// const { exercises, createExercise /* + other methods */ } = useExercises();