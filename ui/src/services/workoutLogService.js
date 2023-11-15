import React, { useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./authService";

const RUNNING_LOCALLY = false;
const USE_LOCAL_DATA = false;

const useWorkoutLogs = (userId) => {
    const [workoutLogs, setWorkoutLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { userToken, user, isLoading: isLoadingAuth } = useAuth();

    useEffect(() => {
        if(!isLoadingAuth)
            refetchWorkoutLogs();
    }, [isLoadingAuth]);

    const refetchWorkoutLogs = () => {
        if(!USE_LOCAL_DATA){
            if(userId){
                fetch(`http://${RUNNING_LOCALLY ? "localhost:3000" : "3.138.86.29" }/user/id/${userId}/workout/logs`, { headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': "Bearer " + userToken
                }})
                .then((response) => response.json())
                .then((data) => {
                    if(data){
                        setWorkoutLogs(data);
                        setIsLoading(false)
                    }
                    else {
                        setWorkoutLogs([]);
                        setIsLoading(false)
                    }
                })
                .catch((e) => {
                    throw e
                })
            }
            // this will never happen but eventually we wil want to do a fetch of ALL workouts (not just those belonging to user) so just leaving this here
            else {
                // fetch(`http://${RUNNING_LOCALLY ? "localhost:3000" : "3.138.86.29" }/workout/logs`)
                // .then((response) => response.json())
                // .then((data) => {
                //     if(data){
                //         setWorkoutLogs(data.filter(logRecord => logRecord.userId.toString() === userId.toString()));
                //         setIsLoading(false)
                //     }
                //     else
                //         setWorkoutLogs([]);
                // })
                // .catch((e) => {
                //     throw e
                // })
            }
        }
        else {

            let dateToday = new Date();

            // note when creating dates in format yyyy-mm-dd, dd is zero indexed
            if(USE_LOCAL_DATA){
                let dummyData = [
                // {
                //     _id: "workout-log-id-3",
                //     workoutId: "workout-id-3",
                //     workoutName: "Leg Day",
                //     date: dateToday,    // todays date
                //     exercises: [],
                // },
                {
                    _id: "workout-log-id-2",
                    workoutId: "workout-id-2",
                    workoutName: "Pull Day",
                    date: new Date(dateToday.getFullYear() + "-" + (dateToday.getMonth() + 1)+ "-" + (dateToday.getDate())),    // yesterday
                    exercises: [],
                },
                {
                    _id: "workout-log-id-1",
                    workoutId: "workout-id-1",
                    workoutName: "Push Day",
                    date: new Date(dateToday.getFullYear() + "-" + (dateToday.getMonth() + 1)+ "-" + (dateToday.getDate() - 1)),    // day before yesterday
                    exercises: [],
                },
                {
                    _id: "workout-log-id-3",
                    workoutId: "workout-id-3",
                    workoutName: "Leg Day",
                    date: new Date(dateToday.getFullYear() + "-" + (dateToday.getMonth() + 1)+ "-" + (dateToday.getDate() - 2)),
                    exercises: [],
                },
                {
                    _id: "workout-log-id-2",
                    workoutId: "workout-id-2",
                    workoutName: "Pull Day",
                    date: new Date(dateToday.getFullYear() + "-" + (dateToday.getMonth() + 1)+ "-" + (dateToday.getDate() - 3)),
                    exercises: [],
                },
                {
                    _id: "workout-log-id-1",
                    workoutId: "workout-id-1",
                    workoutName: "Push Day",
                    date: new Date(dateToday.getFullYear() + "-" + (dateToday.getMonth() + 1)+ "-" + (dateToday.getDate() - 4)),
                    exercises: [],
                }]
                setWorkoutLogs(dummyData);
            }
        }
    }

    const createWorkoutLog = async (newWorkoutLog) => {

        let response;
        try {
            response = await fetch('http://3.138.86.29/workout/logs',{
                method:'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': "Bearer " + userToken
                },
                body: JSON.stringify(newWorkoutLog)
            })
            .then(res => res.json())
        } catch (error) {
            throw error
            // return false //,message
        }
    }

    const editWorkoutLog = (workoutLog) => {

        const dbObj = {
            _id: workoutLog._id,
            name: workoutLog.name,
            creatorId: workoutLog.creatorId,
            description: workoutLog?.description,
            //attachements: workout?.attachments,
        }

        let response = fetch('http://3.138.86.29/workoutLog',{
            method:'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dbObj)
        })
        .then((response) => response.text())

        // return response as proimise
        return response
    }

    return {
        workoutLogs,
        createWorkoutLog,
        refetchWorkoutLogs,
        editWorkoutLog,
        isLoading
    }
}

export { useWorkoutLogs };

// implement in component by doing the following
// const { workoutLogs, createWorkoutLog /* + other methods */ } = useWorkoutLogs();

// after doing so all of the data and functions in this hook can be used