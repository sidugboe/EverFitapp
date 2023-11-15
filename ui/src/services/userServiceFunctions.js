import React, { useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./authService";
import { returnNewerDate } from "../utils/helpers/dateHelper";

const useUserFunctions = (targetUserId, shouldFetchTrainingItems = false, shouldFetchPosts, isTargetUserCurrentUser = false, shouldFetchData = true) => {
    const { userToken, isLoading: isLoadingAuth, user: currentUser } = useAuth();
    
    // fetching user profile
    const fetchUserProfile = (userId) => {
        let userProfile =  fetch('http://3.138.86.29/profile/id/' + userId, { headers: {'Authorization': "Bearer " + userToken}})
            .then((response) => response.json())
            .catch((e) => {
                throw e
            })

        return userProfile
    }

    /**
     * Fetches the profile for a user by username. If the user does not follow that person, thenonly the name, username and profile pic url will be returned
     * @param {string} username username of the user being fetched
     * @returns profile of the user
     */
    const fetchUserProfileByUsername = (username) => {
        let userProfile =  fetch('http://3.138.86.29/profile/u/' + username, { headers: {'Authorization': "Bearer " + userToken}})
            .then((response) => response.json())
            .catch((e) => {
                throw e
            })

        return userProfile
    }

    /**
     * Returns the basic user object for a user - current user does not need to be following them
     * @param {*} userId 
     */
    const fetchUser = async (userId) => {
        let user =  await fetch('http://3.138.86.29/user/id/' + userId, { headers: {'Authorization': "Bearer " + userToken}})
            .then((response) => response.json())
            .catch((e) => {
                throw e
            })

        return user
    }

    // not implemented - can can we fetch routines etc by userId
    const fetchUserTrainingItems = (userId) => {

        let userRoutines = fetch('http://3.138.86.29/routine/user/' + userId, { headers: {'Authorization': "Bearer " + userToken}})
            .then((response) => response.json())
            .catch((e) => {
                throw e
            })
        
        let userWorkouts = fetch('http://3.138.86.29/user/id/' + userId + "/workout/templates", { headers: {'Authorization': "Bearer " + userToken}})
            .then((response) => response.json())
            .catch((e) => {
                throw e
            })

        let userExercises = fetch('http://3.138.86.29/user/id/' + userId + "/exercise/templates", { headers: {'Authorization': "Bearer " + userToken}})
            .then((response) => response.json())
            .catch((e) => {
                throw e
            })

        // return array of promises
        return [userRoutines, userWorkouts, userExercises]
    }

    /**
     * Searches for users by username text
     * @param {string} username user name search field to search by
     * @returns array of users who are returned from the search
     */
    const searchUsersByUserName = (username) => {
        return fetch('http://3.138.86.29/user/search/' + username, { headers: {'Authorization': "Bearer " + userToken}})
            .then((response) => response.json())
            .catch((e) => {
                throw e
            })
    }

    /**
     * Makes the current user follow the provided user
     * @param {string} userId target user id to unfollow
     * @returns {object} { message: "success" OR "User not found."}
     */
    const followUser = async (userId) => {
        let success =  await fetch('http://3.138.86.29/profile/follow/' + userId, { method:'POST', headers: {'Authorization': "Bearer " + userToken}})
            .then((response) => response.json())
            .catch((e) => {
                throw e
            })

        return success; // returns { message: "success" OR "User not found."}
    }

    /**
     * Makes the current user unfollow the provided user
     * @param {string} userId target user id to follow
     * @returns {object} { message: "success" OR "User not found."}
     */
    const unfollowUser = async (userId) => {
        let success =  await fetch('http://3.138.86.29/profile/unfollow/' + userId, { method:'POST', headers: {'Authorization': "Bearer " + userToken}})
            .then((response) => response.json())
            .catch((e) => {
                throw e
            })

        return success;
    }

    /**
     * Function that accesses the most popular users on the app - by followers
     * @returns array of users order by most popular to least
     */
    const fetchPopularUsers = () => {
        let popularUsers =  fetch('http://3.138.86.29/profile/popular', { headers: {'Authorization': "Bearer " + userToken}})
            .then((response) => response.json())
            .catch((e) => {
                throw e
            })

        return popularUsers
    }

    /**
     * Returns posts for a given user by id
     * @param {String} userId 
     * @returns result as a priomise - posts in chronological order
     */
    const fetchUserPosts = (userId) => {

        let response = fetch('http://3.138.86.29/post/user/' + userId, { headers: {'Authorization': "Bearer " + userToken}})
            .then((response) => response.json())
            .then(posts => posts.sort((item1, item2) => returnNewerDate(item1.date, item2.date)))   // sort posts from newest to oldest
            .catch((e) => {
                throw e
            })

        return response
    }

    /**
     * Feteches creator objects for an array of items
     * @param {array} items all haviong a _id property
     * @returns an object with key value pairs for itemId: creatorUserObject
     */
    const fetchItemCreators = async (items, currentUser) => {
        let promises = [];
        let itemIds = []
        let exerciseCreators = {};

        // fetch user objects for all exercise creators
        for(let record of items){
            
            // check that this user isn't the creator because then no need to fetch
            if(record?.creatorId === currentUser._id){
                exerciseCreators[record._id] = currentUser
            }

            let promise = fetchUser(record?.creatorId)

            // let promise = fetchUser(record?.creatorId)
            itemIds.push(record._id)  // add item id as well
            promises.push(promise)
        }

        // if no promises, then all the exercises belong to this use and we can stop
        if(!promises.length)
            return;
        
        // await for all promises to resolve in parallel
        let results = await Promise.allSettled(promises)
        
        // check if any promise were rejected
        let success = true;
        for(let [index, result] of results.entries()){
            if(result.status == "rejected")
                success = false
            else
                exerciseCreators[itemIds[index]] = result.value // add the user to the map
        }

        if(!success){
            // do something
        }

        // return array of itemId: creator object
        return exerciseCreators
    }

    return {
        followUser,
        unfollowUser,
        fetchUser,
        fetchUserProfile,
        fetchUserTrainingItems,
        fetchUserPosts,
        fetchPopularUsers,
        searchUsersByUserName,
        fetchUserProfileByUsername,
        fetchItemCreators
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

export { useUserFunctions };
