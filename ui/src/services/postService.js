import React, { useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./authService";
import { useExercises } from "./exerciseService";
import { useRoutines } from "./routineService";
import { useWorkouts } from "./workoutService";
const USE_LOCAL_DATA = false;

/**
 * Stateless hook that provides funcitons for getting and manipulating posts
 * @returns 
 */
const usePosts = () => {
    const { userToken, user, isLoading: isLoadingAuth, forceReload } = useAuth();

    const createPost = async (newPost) => {
        let response;
        try {
            response = await fetch('http://3.138.86.29/post',{
                method:'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': "Bearer " + userToken
                },
                body: JSON.stringify(newPost)
            });

            // tell auth service to force reload so data is re-fetched
            forceReload();

            return response.json()
        } catch (error) {
            throw e
            // return false //,message
        }
    }

    const editPost = (post) => {
        // edit request
    }

    /**
     * Gets a post by it's id. Note that this route also auto populates post item child routines, workoutTemplates and exerciseTemplates
     * @param {string} postId id of post to be fetched 
     * @returns 
     */
    const getPostById = async (postId) => {

        let post = await fetch('http://3.138.86.29/post/id/' + postId, { headers: {'Authorization': "Bearer " + userToken}})
            .then((response) => response.json())
            .catch((e) => {
                throw e
            })
            
        return post
    }

    /**
     * Likes a post by id
     * @returns response promise
     */
    const likePost = async (postId) => {
        let response = await fetch(`http://3.138.86.29/post/id/${postId}/like`,{
                method:'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': "Bearer " + userToken
                }
            })
            .then(res => res.json())

        return response
    }

    /**
     * Likes a post by id
     * @returns response promise
     */
    const dislikePost = async (postId) => {
        let response = await fetch(`http://3.138.86.29/post/id/${postId}/dislike`,{
                method:'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': "Bearer " + userToken
                }
            });

        return response
    }

    /**
     * Undislikes and unlikes a post by id
     */
    const resetLikeState = async (postId) => {
        let response = await fetch(`http://3.138.86.29/post/id/${postId}/unlike`,{
            method:'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': "Bearer " + userToken
            }
        });

        return response
    }

    return {
        createPost,
        editPost,
        getPostById,
        likePost,
        dislikePost,
        resetLikeState
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

export { usePosts };

// implement in component by doing the following
// const { posts, createPost /* + other methods */ } = usePosts();

// after doing so all of the data and functions in this hook can be used