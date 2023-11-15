import React, { useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./authService";
import { usePosts } from "./postService";
const USE_LOCAL_DATA = false;

const useUserPosts = (userId) => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { userToken, user, isLoading: isLoadingAuth, forceReload } = useAuth();
    const { createPost, editPost, getPostById } = usePosts();   // call to function based (stateless) hook for functions

    // todo maybe separate userid logic to another hook like useUserPosts because certain comopnents don't need user posts at all and only need functions like getPostById (ex postScreen)
    useEffect(() => {
        // note if refetch is ever available we sohuld setIsLoading(true) here
        if(!isLoadingAuth && userToken){
            if(userId)
                getPostsByUser(userId);
            else
                fetchCurrentUserPosts();
        }
    }, [isLoadingAuth]);

    const fetchCurrentUserPosts = () => {
        if(!USE_LOCAL_DATA){
            fetch('http://3.138.86.29/post', { headers: {'Authorization': "Bearer " + userToken}})
                .then((response) => response.json())
                .then((data) => {
                    if(data)
                        setPosts(data);
                    else
                        setPosts([]);
                    setIsLoading(false);
                })
                .catch((e) => {
                    throw e
                })
        }
        else {
            let dummyData = []
            setPosts(dummyData);
        }
    }

    /**
     * Fetches posts belonging to user with provided uuerId. Note this method also exists in useUserData hook
     * @param {string} iuserId 
     * @returns 
     */
    const getPostsByUser = async (iuserId) => {
        let response = await fetch('http://3.138.86.29/post/user/' + userId, { headers: {'Authorization': "Bearer " + userToken}})
            .then((response) => response.json())
            .then((data) => {
                if(data)
                    setPosts(data);
                else
                    setPosts([]);
                setIsLoading(false);
            })
            .catch((e) => {
                throw e
            })
        return response
    }

    return {
        posts,
        isLoading,
        createPost,
        editPost,
        getPostsByUser,
        getPostById
    }
}

export { useUserPosts };

// implement in component by doing the following
// const { posts, createPost /* + other methods */ } = usePosts();

// after doing so all of the data and functions in this hook can be used