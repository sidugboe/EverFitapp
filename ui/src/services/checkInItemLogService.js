// hook used for returning methods for exercises
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "./authService";

const USE_LOCAL_DATA = false;

const useCheckInItemLogs = (userId) => {
    const [userCheckInItemLogs, setUserCheckInItemLogs] = useState([]);
    const { userToken, isLoading: isLoadingAuth } = useAuth()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if(!isLoadingAuth)
            refetchUserCheckInItemLogs();
    }, [isLoadingAuth]);

    const refetchUserCheckInItemLogs = () => {
        setIsLoading(true)
        if(!USE_LOCAL_DATA){
                fetch('http://3.138.86.29/checkin/logs',{
                    headers: { 'Authorization': "Bearer " + userToken }
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if(data){   
                            setUserCheckInItemLogs(data)
                        }
                        else
                            setUserCheckInItemLogs([]);
                        setIsLoading(false)
                    })
                    .catch((e) => {
                        throw e
                    })
        }
        else {     
            // local test data
            let dummyData = [
                {
                    _id: "check-in-item-log-1",
                    checkInItemId: "check-in-item-id-1",
                    value: "182.3",
                    creatorId: "63d1da36d4792fc5c52045cf",
                    date: new Date()
                },
                {
                    _id: "check-in-item-log-2",
                    checkInItemId: "check-in-item-id-2",
                    value: "8.2",
                    creatorId: "63d1da36d4792fc5c52045cf",
                    date: new Date()
                },
                {
                    _id: "check-in-item-log-3",
                    checkInItemId: "check-in-item-id-3",
                    value: "true",
                    creatorId: "63d1da36d4792fc5c52045cf",
                    date: new Date()
                },
                {
                    _id: "check-in-item-log-4",
                    checkInItemId: "check-in-item-id-4",
                    value: "true",
                    creatorId: "63d1da36d4792fc5c52045cf",
                    date: new Date()
                },
                {
                    _id: "check-in-item-log-5",
                    checkInItemId: "check-in-item-id-5",
                    value: "true",
                    creatorId: "63d1da36d4792fc5c52045cf",
                    date: new Date()
                },
                {
                    _id: "check-in-item-log-6",
                    checkInItemId: "check-in-item-id-6",
                    value: "true",
                    creatorId: "63d1da36d4792fc5c52045cf"
                },
                {
                    _id: "check-in-item-log-7",
                    checkInItemId: "check-in-item-id-7",
                    value: "true",
                    creatorId: "63d1da36d4792fc5c52045cf"
                },
                {
                    _id: "check-in-item-log-8",
                    checkInItemId: "check-in-item-id-8",
                    value: "false",
                    creatorId: "63d1da36d4792fc5c52045cf"
                }
            ]
                setUserCheckInItemLogs(dummyData);
        }      
    }

    /**
     * Creates a new check in item log
     * @param {CheckInItemLog} CheckInItemLog to be created as formatted like (link)
     */
    const createCheckInItemLog = (CheckInItemLog) => {
        let response = fetch('http://3.138.86.29/checkin/logs',{
            method:'POST',
            headers: {  
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + userToken 
            },
            body: JSON.stringify(CheckInItemLog)
        })
        .then((response) => response.json())

        return response
    }

    /**
     * Updates the provided check in item log to the new value
     * @param {*} newItem 
     * @returns 
     */
    const editCheckInItemLog = (newItem) => {
        let response = fetch('http://3.138.86.29/checkin/logs',{
            method:'PUT',
            headers: {  
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + userToken 
            },
            body: JSON.stringify(newItem)
        })
            .then((response) => response.json())

        return response
    }

    const deleteCheckInItemLog = (itemId) => {
        // delete request
    }

    return {
        userCheckInItemLogs,
        createCheckInItemLog,
        deleteCheckInItemLog,
        editCheckInItemLog,
        refetchUserCheckInItemLogs,
        isLoading,
    }
}

export { useCheckInItemLogs };