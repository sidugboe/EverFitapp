import React, { useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./authService";

/**
 * Using this only because not sure if we bshould put profile edit inside userService because then would need to implement all userService stuff just to edit routine from training homepage
 * so leaving it seperate for now
 * @returns editProfile function to edit the current user's profile
 */
const useProfile = () => {
    const { userToken, isLoading: isLoadingAuth, user: currentUser } = useAuth();

    const changeUserRoutine = async (newRoutineId) => {

        let response = await getUserProfile()
            .then(profile => {

                let clone = profile
                clone.activeRoutine = newRoutineId
                
                let res = fetch('http://3.138.86.29/profile',{
                        method: 'PUT',
                        headers: { 
                            'Authorization': `Bearer ${userToken}`,
                            'Content-Type': 'application/json' },
                        body: JSON.stringify(clone)
                    })
                return res
            })
            .then((response) => response.json())
            .catch(e => {
                // Throw e
            })
        return response;
    }

    const getUserProfile = async () => {
        let response = await fetch('http://3.138.86.29/profile',{
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            })
            .then((response) => response.json())
            .catch((e) => {
                throw e
            })
        return response
    }

    /**
     * Function that manually changes the user's profile
     * @param {*} updatedProfile 
     */
    const editUserProfile = async (updatedProfile) => {            
        let res = fetch('http://3.138.86.29/profile',{
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProfile)
            })
    }

    /**
     * Changes a user's profile image by updating the imageUrl to a new s3 url (recieved from mediaService after image upload)
     * @param {string} imageUrl new image url
     * @returns 
     */
    const changeUserProfileImage = async (imageUrl) => {
        let response = getUserProfile()
            .then(profile => {

                let clone = profile
                clone.profilePicURL = imageUrl
                
                let res = fetch('http://3.138.86.29/profile',{
                        method: 'PUT',
                        headers: { 
                            'Authorization': `Bearer ${userToken}`,
                            'Content-Type': 'application/json' },
                        body: JSON.stringify(clone)
                    })
                return res
            })
        .then((response) => response.json())
        .catch(e => {
            // Throw e
        })
        
        // return the response as promise
        return response;
    }

    /**
     * Changes the user profile visibility to either public or private
     * @param {string} visibility new visibility "Public" || "Private"
     * @returns response
     */
    const changeUserProfileVisibility = (visibility) => {

        // check visibility is correct format
        if(visibility !== "public" && visibility !== "private"){
            return false;
        }

        let response = getUserProfile()
            .then(profile => {

                let clone = profile
                clone.visibility = visibility 
                
                let res = fetch('http://3.138.86.29/profile',{
                        method: 'PUT',
                        headers: { 
                            'Authorization': `Bearer ${userToken}`,
                            'Content-Type': 'application/json' },
                        body: JSON.stringify(clone)
                    })
                return res
            })
        .then((response) => response.json())
        .catch(e => {
            // Throw e
        })
        
        // return the response as promise
        return response;
    }

    /**
     * Updated the current user's bio to the new text
     * @param {string} text new bio text
     * @returns promise that fulfills once bio is updated
     */
    const changeUserBio = (text) => {
        let response = getUserProfile()
            .then(profile => {

                let clone = profile
                clone.biography = text 
                
                let res = fetch('http://3.138.86.29/profile',{
                        method: 'PUT',
                        headers: { 
                            'Authorization': `Bearer ${userToken}`,
                            'Content-Type': 'application/json' },
                        body: JSON.stringify(clone)
                    })
                return res
            })
        .then((response) => response.json())
        .catch(e => {
            // Throw e
        })
        
        // return the response as promise
        return response;
    }

    return {
        changeUserRoutine,
        changeUserProfileImage,
        getUserProfile,
        changeUserProfileVisibility,    
        changeUserBio
    }
}

export { useProfile };