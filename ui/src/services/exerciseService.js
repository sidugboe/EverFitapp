// hook used for returning methods for exercises
import React, { useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./authService";
import { useExerciseFunctions } from "./exerciseServiceFunctions";

const USE_LOCAL_DATA = false;

const useExercises = () => {
    // state
    const [exercises, setExercises] = useState([]);
    const [isLoading, setIsLoading] = useState(true)

    // component hooks
    const { userToken, isLoading: isLoadingAuth } = useAuth();
    const { createExercise, editExercise, getExerciseById, getPublicExercises, setExerciseToPublic } = useExerciseFunctions();


    useEffect(() => {
        if(!isLoadingAuth)
            refetchExercises();
    }, [isLoadingAuth]);

    const refetchExercises = () => {
        if(!USE_LOCAL_DATA){
                fetch('http://3.138.86.29/exercise/templates/',{
                    headers: {
                        'Authorization': "Bearer " + userToken
                    }
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if(data){   
                            setExercises(data)
                        }
                        else
                            setExercises([]);
                        setIsLoading(false)
                    })
                    .catch((e) => {
                        throw e
                    })
        }
        else {     
            // local test data
            let dummyData = [{
                    _id: "exercise-id-1",
                    name: "Barbell Bench Press",
                    description: "Bench press performed with a barbell on a flat bench. This compound exercise places adaquate emphasis on the chest and triceps.",
                    type: "Compound",
                    muscleGroup: "Pectoralis major, Triceps",
                    sets: 4,
                    workoutId: "workout-id-1"
                },
                {
                    _id: "exercise-id-2",
                    name: "Bench supported cable chest flies",
                    description: "Low to high cable flies performed seated on an inclined bench as to provide a stimulus to the upper chest.",
                    type: "Compound",
                    muscleGroup: "Pectoralis major",
                    sets: 4,    
                    workoutId: "workout-id-1"
                },
                {
                    _id: "exercise-id-3",
                    name: "Johnson curls",
                    description: "600 lbs of curls done with your meat no questions asked",
                    type: "Isolation",
                    muscleGroup: "Johnson Tip",
                    sets: 6,
                    workoutId: "workout-id-1"
                },
                {
                    _id: "exercise-id-4",
                    name: "Deadlifts",
                    description: "I'm not a powerlifter so I don't even know what these are",
                    type: "Compound",
                    muscleGroup: "Literall everything",
                    sets: 2,
                    workoutId: "workout-id-1"
                }]
                setExercises(dummyData);
        }      
    }

    return {
        exercises,
        isLoading,
        refetchExercises,
        createExercise,
        editExercise,
        getExerciseById,
        getPublicExercises,
        setExerciseToPublic
    }
}

export { useExercises };

// implement in component by doing
// const { exercises, createExercise /* + other methods */ } = useExercises();