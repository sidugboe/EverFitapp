import React, { useState, useEffect } from "react";
import { Text, Heading, Pressable, TouchableOpacity } from "react-native";
import { Center, Button, View, ScrollView } from 'react-native';
import { WorkoutCard } from "./WorkoutCard";
import { useWorkouts } from "../../services/workoutService";
import { useWorkoutLogs } from "../../services/workoutLogService";
import { default as EvilIcon } from 'react-native-vector-icons/EvilIcons'
import { getDayInfoComparedToToday } from "../../utils/helpers/dateHelper";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const PreviousWorkoutTable = ({ workoutsShown, isVisible, workoutLogs }) => {

    const onLogPress = (workoutLog) => {
        alert("not implemented :(\n\nShould navigate to a component to view workout log and show child exercise logs + their corresponding set logs. Waiting for db logic for all logs")
        // todo open up overlay or seperate screen to view exercise logs within that workout log
    }

    const styles = {
        completedWorkoutsTable: {
            display: 'flex',
            borderWidth: 2,
            borderColor: 'lightgrey',
            borderRadius: 3,
            height: "41%"
        }
    }

    return (
        <>
            { isVisible &&
                <View style={{margin: 10}}>
                    <Text style={{fontSize: 21, fontFamily: "Roboto", fontWeight: "bold"}}>Completed Workouts</Text>
                    <ScrollView style={styles.completedWorkoutsTable} nestedScrollEnabled={true}>
                        { workoutLogs?.map((workoutLog, index) => {
                            let dateLabel = getDayInfoComparedToToday(workoutLog.date)

                            return (
                                <TouchableOpacity onPress={() => onLogPress(workoutLog)} key={"workout-log-item" + index} style={{display: 'flex', flexDirection: 'row', margin: 2, width: '80%', height: 20 }}>
                                    {/* <View > */}
                                        <View style={{width: "35%"}}>
                                            <Text style={{fontSize: 18}}>{workoutLog?.workoutName}</Text>
                                        </View>
                                        <View style={{ marginLeft: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '80%'}}>
                                            <View>
                                            {dateLabel}
                                            </View>
                                            <View>
                                                <EvilIcon name="chevron-right" size={30}/>
                                            </View>
                                        </View>
                                    {/* </View> */}
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                </View>
            }
        </>
    )
}



export { PreviousWorkoutTable };