import React, { useState, useEffect } from "react";
import { Center, Button, View, ScrollView, Text, Pressable} from 'react-native';
import { useWorkoutLogs } from "../../services/workoutLogService";;
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from "../../services/authService";
import { getDayInfoComparedToToday } from "../../utils/helpers/dateHelper";
import { Heading } from "native-base";
import styles from "../../stylesheet";

const WorkoutLogScreen = ({ navigation, route }) => {

    // hook calls for data
    const { user } = useAuth();
    const { workoutLogs } = useWorkoutLogs(user._id);

    const onWorkoutLogPress = (workout) => {
        navigation.navigate("WorkoutLogExercises", { selectedWorkout: workout })
    }

    return (
        <ScrollView contentContainerStyle={{paddingBottom: "25%"}} style={{ padding: 5, ...styles.RoutineWorkoutExerciseListContiner}}>
            <Heading margin={2} size={"lg"}>{"Workout Logs"}</Heading>
            { workoutLogs.length ? 
                workoutLogs.map((log, index) => {

                    return (
                        <Pressable onPress={() => onWorkoutLogPress(log)} style={{backgroundColor: "#B0B0B0", borderBottomWidth: 1, height: 90, padding: 10}} key={"workout-log-" + index}>
                            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: "100%"}}>
                                <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
                                    <Text style={{fontSize: 25}}>{log.name}</Text>

                                    <View style={{display: 'flex', flexDirection: "row", justifyContent: 'space-between', width: "55%"}}>
                                        <Text style={{fontSize: 17}}>{getDayInfoComparedToToday(log.date) + ", "}</Text>
                                        <Text style={{fontSize: 17}}>{log.exerciseLogs?.length + " exercises"}</Text>
                                    </View>
                                    
                                </View>
                                <Icon name={"chevron-right"} size={30} style={{marginRight: 20}}/>
                            </View>
                        </Pressable>
                    )
                })
            :
            <Text>You have no completed workouts.</Text>
            }
        </ScrollView>
    )
}

export { WorkoutLogScreen}