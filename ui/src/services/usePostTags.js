import React, { useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./authService";
const USE_LOCAL_DATA = false;

const usePostTags = (userId) => {
    const [postTags, setPostTags] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { userToken, user, isLoading: isLoadingAuth } = useAuth();

    useEffect(() => {
        // note if refetch is ever available we sohuld setIsLoading(true) here
        if(!isLoadingAuth){
            getAllPostTags();
        }
    }, [isLoadingAuth]);

    const getPostsByTag = async (tag) => {
        let response = await fetch('http://3.138.86.29/tag/' + tag, { headers: {'Authorization': "Bearer " + userToken}})
            .then((response) => response.json())
            .catch((e) => {
                throw e
            })

        return response
    }

    /**
     * Returns list of all tags that can be added to posts
     */
    const getAllPostTags = () => {
        fetch('http://3.138.86.29/post/tags', { headers: {'Authorization': "Bearer " + userToken}})
            .then((response) => response.json())
            .then((data) => {
                if(data)
                    setPostTags(data);
                else
                    setPostTags([]);
                setIsLoading(false);
            })
            .catch((e) => {
                throw e
            })
    }

    return {
        postTags,
        isLoading,
        getPostsByTag,
    }
}

export { usePostTags };