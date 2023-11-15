import React, { useState, useEffect } from "react";
import { Text, Button, View, ScrollView, TouchableOpacity } from 'react-native';
import { WorkoutCard } from "./WorkoutCard";
import { useWorkouts } from "../../services/workoutService";
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from "../../stylesheet";

/**
 * List of workouts displayed in cards
 * After doing so the user is navigated to this screen that shows the workouts within said routine
 * @param {*} props 
 * @returns 
 */
const WorkoutList = ({ workouts, navigation, belongsToUser = true, setTrainingLibrarySettings }) => {

    const onAddWorkoutsToRoutine = (workouts) => {
        // add workouts to routine
        let updatedRoutine = {
            
        }
        //editRoutine()
    }

    // todo this adds workout to routine but on profile it should create a new workout
    const onAddWorkoutPress = () => {
        setTrainingLibrarySettings({isVisible: true, mode: "selectMultiple", itemType: "workout", onConfirmItems: onAddWorkoutsToRoutine, confirmationModalTitle: "Add workouts to routine?", confirmationModalBody: "Are you sure you want to add the selected item(s) to this routine?"})
    }
    
    return (
        <ScrollView style={{padding: 5, ...styles.RoutineWorkoutExerciseListContiner}}>
            { workouts?.length ? 
                workouts?.map((workout, index) => {
                    return (
                        <View style={{paddingVertical: 10}} key={"workout-" + index}>
                            <WorkoutCard workout={workout} navigation={navigation} onCardPress={() => navigation.navigate("Exercises", { workoutData: workout })}/>
                        </View>
                    )
            })
            :
            <View style={{margin: 5}}>
                <Text style={{fontSize: 20}}>No workouts yet</Text>
                { belongsToUser &&
                    <TouchableOpacity onPress={onAddWorkoutPress} style={{width: "100%", height: 50, borderRadius: 6, borderColor: '#B0B0B0', borderWidth: 2, display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginTop: 20, backgroundColor: "white"}}>
                        <Text style={{fontSize: 20, marginLeft: 15}}>Add workouts</Text>
                        <View style={{ marginRight: 15}}>
                            <Icon name="add" size={29} style={{padding: 3, paddingTop: 4}}/>
                        </View>
                    </TouchableOpacity>
                }
            </View>
            }            
        </ScrollView>
    )
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

export { WorkoutList };