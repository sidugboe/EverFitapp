// hook used for returning methods for exercises
import React, { useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./authService";

const USE_LOCAL_DATA = false;

const useCheckInItems = (userId) => {
    const { userToken, isLoading: isLoadingAuth } = useAuth()
    const [userCheckInItems, setUserCheckInItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        refetchUserCheckInItems();
    }, []);

    const refetchUserCheckInItems = () => {
        if(!USE_LOCAL_DATA){
                fetch('http://3.138.86.29/checkin/templates',{ headers: { 'Authorization': "Bearer " + userToken }
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if(data){   
                            setUserCheckInItems(data)
                        }
                        else
                            setUserCheckInItems([]);
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
                    _id: "check-in-item-id-1",
                    name: "dry weight",
                    itemType: "number",
                    creatorId: "63d1da36d4792fc5c52045cf"
                },
                {
                    _id: "check-in-item-id-2",
                    name: "hours of sleep",
                    itemType: "number",
                    creatorId: "63d1da36d4792fc5c52045cf"
                },
                {
                    _id: "check-in-item-id-3",
                    name: "take creatine",
                    itemType: "checkbox",
                    creatorId: "63d1da36d4792fc5c52045cf"
                },
                {
                    _id: "check-in-item-id-4",
                    name: "take supplements",
                    itemType: "checkbox",
                    creatorId: "63d1da36d4792fc5c52045cf"
                },
                {
                    _id: "check-in-item-id-5",
                    name: "water 2L",
                    itemType: "checkbox",
                    creatorId: "63d1da36d4792fc5c52045cf"
                },
                {
                    _id: "check-in-item-id-6",
                    name: "water 3L",
                    itemType: "checkbox",
                    creatorId: "63d1da36d4792fc5c52045cf"
                },
                {
                    _id: "check-in-item-id-7",
                    name: "water 4L",
                    itemType: "checkbox",
                    creatorId: "63d1da36d4792fc5c52045cf"
                },
                {
                    _id: "check-in-item-id-8",
                    name: "water 5L",
                    itemType: "checkbox",
                    creatorId: "63d1da36d4792fc5c52045cf"
                },
                {
                    _id: "check-in-item-id-9",
                    name: "vitamin D 3000 UI",
                    itemType: "checkbox",
                    creatorId: "63d1da36d4792fc5c52045cf"
                },
                {
                    _id: "check-in-item-id-10",
                    name: "Omega-3 900mg",
                    itemType: "checkbox",
                    creatorId: "63d1da36d4792fc5c52045cf"
                },
            ]
                setUserCheckInItems(dummyData);
        }      
    }

    /**
     * Creates a new check in item
     * @param {CheckInItem} checkInItem to be created as formatted like https://github.com/Luiz-SE/se4450-project-group-8/blob/master/api/src/db/schemas/checkInTemplate.js
     */
    const createCheckInItem = (checkInItem) => {
        let response = fetch('http://3.138.86.29/checkin/templates',{
            method:'POST',
            headers: {  
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + userToken 
            },
            body: JSON.stringify(checkInItem)
        })
        .then((response) => response.json())

        return response
    }

    /**
     * Updates the provided check in item
     * @param {*} newItem 
     * @returns 
     */
    const editCheckInItem = (checkInItem) => {
        let response = fetch('http://3.138.86.29/checkin/templates',{
            method:'PUT',
            headers: {  
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + userToken 
            },
            body: JSON.stringify(checkInItem)
        })
            .then((response) => response.json())

        return response
    }

    /**
     * Deletes a check in item by id
     */
    const deleteCheckInItem = (itemId) => {
        let response = fetch('http://3.138.86.29/checkin/templates/' + itemId, {
            method:'DELETE',
            headers: {  
                'Authorization': "Bearer " + userToken 
            }
        })
            .then((response) => response.json())

        return response
    }

    return {
        userCheckInItems,
        createCheckInItem,
        deleteCheckInItem,
        editCheckInItem,
        refetchUserCheckInItems,
        isLoading
    }
}

export { useCheckInItems };