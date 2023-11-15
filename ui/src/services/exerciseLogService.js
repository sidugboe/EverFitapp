import React, { useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./authService";

const USE_LOCAL_DATA = false;

const useExerciseLogs = () => {
    const [exerciseLogs, setExerciseLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { userToken, user, isLoading: isLoadingAuth } = useAuth();

    useEffect(() => {
        if(userToken)
            refetchExerciseLogs();
    }, [isLoadingAuth]);

    const refetchExerciseLogs = () => {
        if(!USE_LOCAL_DATA){
            fetch('http://3.138.86.29/exercise/logs', { headers: {'Authorization': "Bearer " + userToken}})
                .then((response) => response.json())
                .then((data) => {
                    if(data){
                        setExerciseLogs(data);
                        setIsLoading(false);
                    }
                    else {
                        exerciseLogs([]);
                        setIsLoading(false);
                    }
                })
                .catch((e) => {
                    throw e
                })
        }
        else {
            // local test data
            let dummyData = [
            {
                _id: "exercise-log-id-1",
                exerciseNo: 1,
                exerciseId: "exercise-id-1",
                notes: "went well felt good",
                muscleGroup: ['arms', 'shoulders'],
                date: '2022-12-15',
                sets: []
            },
            {
                _id: "exercise-log-id-2",
                exerciseNo: 2,
                exerciseId: "exercise-id-2",
                notes: "tired from first exercise but went well",
                muscleGroup: ['legs'],
                date: '2022-12-20',
                sets: []
            },
            {
                _id: "exercise-log-id-3",
                exerciseNo: 3,
                exerciseId: "exercise-id-3",
                notes: "weaker today not sure why",
                muscleGroup: ['arms', 'back'],
                date: '2022-11-15',
                sets: []
            },
            {
                _id: "exercise-log-id-4",
                exerciseNo: 4,
                exerciseId: "exercise-id-4",
                notes: "progressed well",
                muscleGroup: ['chest', 'shoulders'],
                date: '2022-12-25',
                sets: []
            },
            {
                _id: "exercise-log-id-5",
                exerciseNo: 4,
                exerciseId: "exercise-id-4",
                notes: "progressed well",
                muscleGroup: ['chest', 'shoulders'],
                date: '2023-1-20',
                sets: []
            },
            {
                _id: "exercise-log-id-6",
                exerciseNo: 4,
                exerciseId: "exercise-id-4",
                notes: "progressed well",
                muscleGroup: ['chest', 'shoulders'],
                date: '2022-2-1',
                sets: []
            }]
            setExerciseLogs(dummyData);
            setIsLoading(false);
        }
    }

    // not implemented (yet) because no backend endpoint for insertMany
    const createExerciseLogs = (newExerciseLogs) => {
        try {
            response = fetch('http://3.138.86.29/exercise/logs',{
                method:'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': "Bearer " + userToken
                },
                body: JSON.stringify(newExerciseLog)
            });

            // todo grab logic from exerciseScreen where we save multiple exercises and put it here
            // createExerciseLog also returns promises but we may want to have an option to return a reponse AFTER the promise is resolved
            return response;

        } catch (error) {
            return false //,message
        }
    }

    const createExerciseLog = async (newExerciseLog) => {
        
        let response;
        try {
            response = await fetch('http://3.138.86.29/exercise/logs',{
                method:'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': "Bearer " + userToken
                },
                body: JSON.stringify(newExerciseLog)
            });
            return response.json()
        } catch (error) {
            throw e
            // return false //,message
        }
    }

    const editExerciseLog = (exerciseLog) => {

        const dbObj = {
            _id: exerciseLog._id,
            name: exerciseLog.name,
            creatorId: exerciseLog.creatorId,
            muscle: [],
            muscleArea: [],
            muscleGroup: exerciseLog?.muscle,
            description: exerciseLog?.description,
            attachements: exerciseLog?.description,
        }

        fetch('http://3.138.86.29/',{
            method:'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dbObj)
        })
            .then((response) => response.text())
    }

    return {
        exerciseLogs,
        isLoading,
        createExerciseLog,
        refetchExerciseLogs,
        editExerciseLog
    }
}

export { useExerciseLogs };

// implement in component by doing:
// const { exerciseLogs, createExerciseLog, refetchExerciseLogs /* + other methods */ } = useExercises();

// some code

// refetchExercises()
// exerciseLogs.map((item) => <Text>item.name</Text>)