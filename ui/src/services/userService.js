import React, { useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./authService";
import { useUserFunctions } from "./userServiceFunctions";

/**
 * Fetches the profile, training items and posts for the specified user
 * @param {string} targetUserId id of the user to retrieve data for
 * @returns user trainingItems, userPosts and user (profile)
 */
const useUserData = (targetUserId) => {
    
    // component state
    const [user, setUser] = useState({});
    const [userPosts, setUserPosts] = useState([])
    const [userTrainingItems, setUserTrainingItems] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // data hooks
    const { isLoading: isLoadingAuth, user: currentUser } = useAuth();
    const { fetchUserProfile, fetchUserTrainingItems, fetchUserPosts } = useUserFunctions()

    useEffect(() => {
        if(!isLoadingAuth){
            if(!targetUserId)   // if no user id passed in stop loading. Might be able to do this earlier without waiting for auth to load but fine here for now (todo)
                setIsLoading(false)
            else
                fetchUserData();
        }
    }, [isLoadingAuth, targetUserId]);

    const fetchUserData = async () => {
        // make requests
        let userProfilePromise = fetchUserProfile(targetUserId);
        let trainingItemPromises = fetchUserTrainingItems(targetUserId)
        let postsPromise = fetchUserPosts(targetUserId)

        // wait for all promises to be settled
        let results = await Promise.allSettled([...trainingItemPromises, postsPromise, userProfilePromise])

        // check if any promise were rejected
        let success = true;
        for(let result of results){
            if(result.status == "rejected" || result.status !== "fulfilled")
                success = false;
        }

        if(!success){
            // do something
        }
        else { // apply values to compnent state

            let trainingItems = {
                routines: results[0].value,
                workouts: results[1].value,
                exercises: results[2].value
            }

            setUserTrainingItems(trainingItems)
            setUserPosts(results[3].value)
            setUser(results[4].value);
            // todo logs
        }
        setIsLoading(false)
    }

    return {
        user,
        userPosts,
        userTrainingItems,
        isLoading,
        fetchUserData,
        currentUserFromAuth: currentUser,
    }
}

// polyfill issues with promise.allSettles becuase verioning
Promise.allSettled = Promise.allSettled || ((promises) => Promise.all(
    promises.map(p => p
        .then(value => ({
            status: "fulfilled",
            value
        }))
        .catch(reason => ({
            status: "rejected",
            reason
        }))
    )
));

export { useUserData };

// implement in component by doing:
// const { exerciseLogs, createExerciseLog, refetchExerciseLogs /* + other methods */ } = useUsers(userIdToBeFetched, true, true);