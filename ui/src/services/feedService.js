import React, { useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./authService";

const USE_LOCAL_DATA = false;

const useFeed = () => {
    const [feed, setFeed] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { userToken, user, isLoading: isLoadingAuth } = useAuth();

    useEffect(() => {
        if(userToken)
            refetchFeed();
    }, [isLoadingAuth]);

    const refetchFeed = () => {
        if(!USE_LOCAL_DATA){
            fetch('http://3.138.86.29/feed', { headers: {'Authorization': "Bearer " + userToken}})
                .then((response) => response.json())
                .then((data) => {
                    if(data)
                        setFeed(data)
                    else
                        setFeed([])
                    setIsLoading(false);
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
                notes: "went well felt good"
            },
            {
                _id: "exercise-log-id-2",
                exerciseNo: 2,
                exerciseId: "exercise-id-2",
                notes: "tired from first exercise but went well"
            },
            {
                _id: "exercise-log-id-3",
                exerciseNo: 3,
                exerciseId: "exercise-id-3",
                notes: "weaker today not sure why"
            },
            {
                _id: "exercise-log-id-4",
                exerciseNo: 4,
                exerciseId: "exercise-id-4",
                notes: "progressed well"
            }]
            setExerciseLogs(dummyData);
            setIsLoading(false);
        }
    }

    return {
        feed,
        isLoading,
        refetchFeed
    }
}

export { useFeed };