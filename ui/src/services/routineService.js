// hook used for returning methods for exercises
import React, { useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./authService";

const USE_LOCAL_DATA = false;

// todo update this hoiok so that components who don't need the routine state and only want functoins can implement it without taking in state as well
const useRoutines = (userId) => {
    const [routines, setRoutines] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const { userToken, user, isLoading: isLoadingAuth } = useAuth();
    
    useEffect(() => {
        if(!isLoadingAuth)
            refetchRoutines();
    }, [isLoadingAuth]);

    const refetchRoutines = () => {
        if(!USE_LOCAL_DATA){
            fetch('http://3.138.86.29/routine/', { headers: {'Authorization': "Bearer " + userToken}})
                .then((response) => response.json())
                .then((data) => {
                    if(data)
                        setRoutines(data);
                    else
                        setRoutines([]);
                    setIsLoading(false);
                })
                .catch((e) => {
                    throw e
                })
        }
        else {
            let dummyData = [{
                _id: "routine-id-1",
                name: "PPL",
                description: "three day split ordered push pull legs with one rest day",
                workoutTemplates: ["workout-id-1", "workout-id-2", "workout-id-3"],
                creatorId: 'user-id-123'
                //days: 4,
            },
            {
                _id: "routine-id-2",
                name: "Bro Split",
                description: "five day split ordered chest, back, shoulders & traps, legs, arms, rest, rest",
                workoutTemplates: ["workout-id-1", "workout-id-2", "workout-id-3"],
                creatorId: 'user-id-123'
                //days: 7,
            },
            {
                _id: "routine-id-3",
                name: "Arnold Split",
                description: "3 day split ordered chest/back, shoulders/arms, legs",
                workoutTemplates: ["workout-id-1", "workout-id-2", "workout-id-3"],
                creatorId: 'user-id-123'
                //sets: 6,
            },]
            setRoutines(dummyData);
        }
    }

    const createRoutine = (newRoutine) => {
        let response = fetch('http://3.138.86.29/routine',{
                method:'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': "Bearer " + userToken
                },
                body: JSON.stringify(newRoutine)
            })
            .then((response) => response.text())

        // return response as proimise
        return response
    }

    const editRoutine = (routine) => {

        const dbObj = {
            _id: routine._id,
            name: routine.name,
            creatorId: routine.creatorId,
            description: routine?.description,
            //attachements: routine?.attachments,
        }

        let response = fetch('http://3.138.86.29/routine',{
                method:'PUT',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': "Bearer " + userToken
                },
                body: JSON.stringify(dbObj)
            })
            .then((response) => response.text())

        // return response as proimise
        return response
    }

    /**
     * NOT IMPLEMENTED YET AWAITING BACKEND LOGIC
     * Function that fetches public routines
     * note should eventually return by most popular
     * @returns array of public routines
     */
    const fetchPublicRoutines = () => {
        let publicRoutines =  fetch('http://3.138.86.29/public/routine', { headers: {'Authorization': "Bearer " + userToken}})
            .then((response) => response.json())
            .catch((e) => {
                throw e
            })

        //return publicRoutines
    }


    /**
     * Gets a public routine by id
     * @param {string} routineId id of routine to GET
     */
    const getRoutineById = async (routineId) => {
        let response = fetch('http://3.138.86.29/routine/id/' + routineId, { headers: {'Authorization': "Bearer " + userToken}})
            .then((response) => response.json())
            .then((data) => {
                if(data)
                    setRoutines(data);
                else
                    setRoutines([]);
                setIsLoading(false);
            })
            .catch((e) => {
                throw e
            })

        return response;
    }

    const setRoutineToPublic = async (routineId) => {

        // fetch the routine by id
        let routine = await fetch('http://3.138.86.29/routine/id/' + routineId, { headers: {'Authorization': "Bearer " + userToken}})
            .then((response) => response.json())
            .catch((e) => {
                throw e
            })

        // return if routine is already public
        if(routine.access === "public")
            return
        
        // set the routine to public and then PUT
        routine.access = "public"

        let response = fetch('http://3.138.86.29/routine',{
                method:'PUT',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': "Bearer " + userToken
                },
                body: JSON.stringify(routine)
            })
            .then((response) => response.text())

        // return response as proimise
        return response
    }

    return {
        routines,
        isLoading,
        createRoutine,
        refetchRoutines,
        editRoutine,
        isLoading,
        fetchPublicRoutines,
        getRoutineById,
        setRoutineToPublic
    }
}

export { useRoutines };

// implement in component by doing the following
// const { routines, createRoutine /* + other methods */ } = useRoutines();

// after doing so all of the data and functions in this hook can be used