import React, { useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./authService";
import { useExercises } from "./exerciseService";

const USE_LOCAL_DATA = false;

const useWorkouts = (userId) => {
    const { userToken, isLoading: isLoadingAuth, user } = useAuth()
    const [workouts, setWorkouts] = useState([]);
    const [isLoading, setIsLoading] = useState(true)

    const { setExerciseToPublic } = useExercises();

    useEffect(() => {
        if(!isLoadingAuth)
            refetchWorkouts();
    }, [isLoadingAuth]);

    const refetchWorkouts = () => {
        if(!USE_LOCAL_DATA){
            if(userId){
                fetch(`http://3.138.86.29/user/id/${userId}/workout/templates/`, { headers: {'Authorization': "Bearer " + userToken}})
                .then((response) => response.json())
                .then((data) => {
                    if(data)
                        setWorkouts(data);
                    else
                        setWorkouts([]);
                    setIsLoading(false)
                })
                .catch((e) => {
                    throw e
                })
            }
            else if(user?._id){
                // else fetch ALL workout templates ( or should we fetch only the user's)
                fetch(`http://3.138.86.29/user/id/${user?._id}/workout/templates/`, { headers: {'Authorization': "Bearer " + userToken}})
                    .then((response) => response.json())
                    .then((data) => {
                        if(data){
                            setWorkouts(data);
                        } 
                        else
                            setWorkouts([]);
                        setIsLoading(false)
                    })
                    .catch((e) => {
                        throw e
                    })
            }
        }
        else {
            let dummyData = [{
                _id: "workout-id-1",
                routineId: "routine-id-1",
                name: "Push Day",
                description: "chest, triceps and shoulders workout",
                //exercises: ["63dc3d2eea446f083ffea3af"],
                //exerciseTemplates: ["exercise-id-1", "exercise-id-2", "exercise-id-3"],
                exerciseTemplates: ["63dc3d2eea446f083ffea3af"]
            },
            {
                _id: "workout-id-2",
                routineId: "routine-id-1",
                name: "Pull Day",
                description: "Back and biceps workout",
                //exercises: ["63dc3d8ba17d61b17470d2d0", "63dc3d7ba17d61b17470d2cc", "63dc3c8847c48fdc2c20aed9"],
                //exerciseTemplates: ["exercise-id-1", "exercise-id-2", "exercise-id-3"],
                exerciseTemplates: ["63dc3d8ba17d61b17470d2d0", "63dc3d7ba17d61b17470d2cc", "63dc3c8847c48fdc2c20aed9"]
            },
            {
                _id: "workout-id-3",
                routineId: "routine-id-1",
                name: "Leg Day",
                description: "Leg workout",
                exerciseTemplates: [],
            }]
            setWorkouts(dummyData);
        }
    }

    const createWorkout = (newWorkout) => {
        // fetch POST here
        let response = fetch('http://3.138.86.29/workout/templates',{
            method:'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': "Bearer " + userToken
            },
            body: JSON.stringify(newWorkout)
        })
            .then((response) => response.text())

        // return response as promise
        return response;
    }

    const editWorkout = (workout) => {

        const dbObj = {
            _id: workout._id,
            name: workout.name,
            creatorId: workout.creatorId,
            description: workout?.description,
            //attachements: workout?.attachments,
        }

        fetch('http://3.138.86.29/workout',{
            method:'PUT',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': "Bearer " + userToken
            },
            body: JSON.stringify(dbObj)
        })
            .then((response) => response.text())
    }

    /**
     * gets a public workout by id
     * @param {string} workoutId id of the workout to GET
     */
    const getWorkoutById = async (workoutId) => {
        let response = fetch('http://3.138.86.29/workout/templates/' + workoutId, { headers: {'Authorization': "Bearer " + userToken}})
                .then((response) => response.json())
                .catch((e) => {
                    throw e
                })

        return response;
    }

    const setWorkoutToPublic = async (workoutId) => {
        // get the workout
        let workout = await getWorkoutById(workoutId)

        // change to public
        workout.access = "public"

        // update the workout with new visibility
        let response = fetch('http://3.138.86.29/workout/templates/id' + workoutId,{
            method:'PUT',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': "Bearer " + userToken
            },
            body: JSON.stringify(workout)
        })
            .then((response) => response.json())

        // return result as promise
        return response
    }

    const getWorkoutsByID = (workoutIDs) => {
        let workoutsFromIDs = [];

        // convert array of ids to strings
        let stringExerciseIds = workoutIDs?.map(id => id?.toString())
        for(let wo of workouts){
            if(stringExerciseIds?.includes(wo._id?.toString())){
                workoutsFromIDs?.push(wo)
            }
        }
        return workoutsFromIDs;
    }

    /**
     * Function that fetches public workouts
     * note should eventually return by most popular
     * @returns array of public workouts
     */
    const fetchPublicWorkouts = () => {
        let publicWorkouts =  fetch('http://3.138.86.29/public/workout/templates', { headers: {'Authorization': "Bearer " + userToken}})
            .then((response) => response.json())
            .catch((e) => {
                throw e
            })

        return publicWorkouts

        }

    
    /** Fetches public workouts for an array of workout ids and returns array of promises
     * @param {Array} workoutIds array of workout ids
     * @returns array of promises for each workout
     */
    const getPublicWorkoutsById = (workoutIds) => {
        let workoutPromises = [];

        for(let workoutId of workoutIds){
            let promise = getWorkoutById(workoutId);
            workoutPromises.push(promise)
        }

        // return the array of promises
        return workoutPromises;
    }

    /**
     * Sets a workout to public along with all child exercises. If workout is already public it will not be changed but children will be updated
     * @param {string} workoutId id of the workout to be updated
     * @returns nothing
     */
    const setWorkoutAndChildrenToPublic = async (workoutId) => {
        // get the workout
        let workout = await getWorkoutById(workoutId)

        if(workout.access === "private"){
            // change to public
            workout.access = "public"

            // update the workout with new visibility
            let response = fetch('http://3.138.86.29/workout/templates/',{
                method:'PUT',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': "Bearer " + userToken
                },
                body: JSON.stringify(workout)
            })
                .then((response) => response.json())
        }

        // for all private exercises, set to public
        let promises = [];
        for(let exercise of workout.exerciseTemplates){
            if(exercise.access === "private"){
                let res = setExerciseToPublic(exercise)
                promises.push(res)
            }
        }

        // wait for all promises to be complete before returning to previous screen
        let results = await Promise.allSettled(promises)
            
        // check if any promise were rejected)
        let success = true;
        for(let result of results){
            if(result.status == "rejected")
                success = false;
        }

        if(!success){
            // do something
        }

        return
    }

    return {
        workouts,
        isLoading,
        createWorkout,
        refetchWorkouts,
        editWorkout,
        getWorkoutsByID,
        fetchPublicWorkouts,
        getWorkoutById,
        getWorkoutsByID,
        setWorkoutToPublic,
        getPublicWorkoutsById,
        setWorkoutAndChildrenToPublic
    }
}

export { useWorkouts };

// implement in component by doing the following
// const { workouts, createWorkout /* + other methods */ } = useWorkouts();

// after doing so all of the data and functions in this hook can be used