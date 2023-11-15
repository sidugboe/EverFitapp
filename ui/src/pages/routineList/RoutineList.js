import React, { useState, useEffect } from "react";
import { Center, Button, View, ScrollView, Text, TouchableOpacity} from 'react-native'; 
import { RoutineCard } from "./RoutineCard";
import styles from "../../stylesheet";
import Icon from 'react-native-vector-icons/MaterialIcons';

/**
 * The list of routines
 * @param {Array} routines array of routines to be rendered in the list 
 * @param {Object} navigation navigaitobn prop
 * @returns 
 */
const RoutineList = ({ routines, navigation, belongsToUser, setTrainingLibrarySettings }) => {

    onAddRoutinePress = () => {
        setTrainingLibrarySettings({isVisible: true, mode: "selectMultiple", itemType: "routine", onConfirmItems: onAddWorkoutsToRoutine, confirmationModalTitle: "Add workouts to routine?", confirmationModalBody: "Are you sure you want to add the selected item(s) to this routine?"})
    }

    return (
        <ScrollView contentContainerStyle={{paddingBottom: "25%"}} style={{ padding: 5, ...styles.RoutineWorkoutExerciseListContiner}}>
            { routines.length ? 
                <>
                    { routines?.map((routine, index) => {
                        return (
                            <RoutineCard routine={routine} navigation={navigation} key={"routine-card-" + index}/>
                        )
                    })}
                </>
                :
                <View style={{margin: 5}}>
                    <Text style={{fontSize: 20}}>No routines yet</Text>
                    { belongsToUser &&
                        <TouchableOpacity onPress={onAddRoutinePress} style={{width: "100%", height: 50, borderRadius: 6, borderColor: '#B0B0B0', borderWidth: 2, display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginTop: 20, backgroundColor: "white"}}>
                            <Text style={{fontSize: 20, marginLeft: 15}}>Create Routine</Text>
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

export { RoutineList };