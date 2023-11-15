import React, { useState, useEffect } from "react";
import { Center, Button, View, ScrollView, Text, TouchableOpacity} from 'react-native';
import { useRoutines } from "../../services/routineService";
import { RoutineCard } from "./RoutineCard";
import AppBarHeader from "../../components/appbars/AppbarHeader";
import { PreviousWorkoutTable } from "../../components/previousWorkouts/PreviousWorkoutList";
import { useWorkoutLogs } from "../../services/workoutLogService";
import { useWorkouts } from "../../services/workoutService";
import styles from "../../stylesheet";
import { RoutineList } from "./RoutineList";

const USER_CURRENT_SPLIT_ID = "routine-id-2"    // active routine id which is assumed will be stored in user data somewhere
const USER_ID = "user-id-123"   // hard coded userId

/**
 * The screen rendered when user navigates to their personal routines where all of their routines are
 * @param {*} props 
 * @returns 
 */
const RoutineScreen = (props) => {
    const { navigation, route} = props

    // hook calls
    const { routines } = useRoutines(/*USER_ID*/);
    const { workoutLogs } = useWorkoutLogs(/*USER_ID*/);
    const { workouts } = useWorkouts(/*USER_ID*/);

    return (
        <View style={{display: 'flex', flexDirection: "column", height: "100%"}}>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, padding: 4}}>
                <Text style={{fontSize: 36, fontWeight: 'bold', color: '#000000'}}>Routines</Text>
                {/*<Button title='Create Routine' onPress={onButtonPress} color='#f59e0b'></Button>*/}
            </View>
            <View>
                <RoutineList navigation={navigation} routines={routines}/>
            </View>
        </View>
    )
}

export { RoutineScreen };