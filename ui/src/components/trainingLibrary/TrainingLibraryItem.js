import React, { useState, useEffect } from "react";
import { Center, Button, View, ScrollView, Text, TouchableOpacity} from 'react-native';
import { useRoutines } from "../../services/routineService";
import { RoutineCard } from "./RoutineCard";
import AppBarHeader from '../appbars/AppbarHeader'
import { PreviousWorkoutTable } from "../previousWorkouts/PreviousWorkoutList";
import { useWorkoutLogs } from "../../services/workoutLogService";
import { forceTouchGestureHandlerProps } from "react-native-gesture-handler/lib/typescript/handlers/ForceTouchGestureHandler";
import { useWorkouts } from "../../services/workoutService";
import Icon from 'react-native-vector-icons/MaterialIcons';

const USER_CURRENT_SPLIT_ID = "routine-id-2"    // active routine id which is assumed will be stored in user data somewhere
const USER_ID = "user-id-123"   // hard coded userId

/**
 * Screen that renders a list of all training objects including Routines, Workouts, Exercises, with logic to select, view, filter, create and edit these items
 * @param {*} props 
 * @returns 
 */
const TrainingLibraryItem = ({ navigaiton, item, isSelected, onCardSelect, mode = "select"}) => {
    // const [isSelected, setIsSelected] = useState(false)

    const onItemPress = () => {

        if(mode === "select"){
            // setIsSelected(prev => !prev)
        }

        if(isSelected){
            onCardSelect(item, false)
        }
        else {
            onCardSelect(item, true)
        }
    }

    const assignColour = (entity) => {
        if (entity.toLowerCase() == "routine")
            return ('#b45309')
        else if (entity.toLowerCase() == "workout")
            return ('#15803d')
        else if (entity.toLowerCase() == "exercise")
            return ('#1d4ed8')
    }

    return (
        <TouchableOpacity onPress={onItemPress} style={{borderWidth: 1, margin: 7, padding: 4, borderRadius: 8}}>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{display: 'flex', flexDirection: 'column'}}>
                    <Text style={{fontSize: 16, fontWeight: "bold"}}>{item.name}</Text>
                    <Text style={{color: assignColour(item.type)}}>{item.type}</Text>
                </View>
                { ((mode === "select" || mode === "selectMultiple") && isSelected) &&
                    <View>
                        <Icon name="check" size={30} style={{padding: 3, paddingTop: 5}}/>
                    </View>
                }
            </View>
        </TouchableOpacity>
    );
}

export { TrainingLibraryItem };