import React, { useContext, useState, useEffect, useRef } from "react";
import { Text, TextInput, TouchableOpacity, View, Modal, StyleSheet, Pressable, Keyboard, ScrollView } from 'react-native';
import { useExerciseLogs } from "../../services/exerciseLogService";
import { useWorkoutLogs } from "../../services/workoutLogService";
import { useExerciseSetLogs } from "../../services/exerciseSetLogService";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDayInfoComparedToToday } from "../../utils/helpers/dateHelper";
import { Heading } from "native-base";

const ExerciseLogCard = ({ exerciseLog, selectedExercise, setSelectedExercise, height = "20%", showExerciseName = true, cardColor = "#B0B0B0", cardBorderRadius = 0 }) => {

    isExerciseSelected = selectedExercise === exerciseLog._id

    const onExerciseLogPress = () => {
        setSelectedExercise(prev => prev == exerciseLog._id ? "" : exerciseLog._id)
    }

    let reducedExerciseSets = exerciseLog?.sets?.filter(x => x ? true : false);

    return (
        <View>
            <Pressable onPress={onExerciseLogPress} style={{height: 75, backgroundColor: cardColor, borderBottomWidth: isExerciseSelected ? 0 : 1, padding: 10, boarderRadius: cardBorderRadius}} key={"workout-log-" + index}>
                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: "100%"}}>
                    <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
                        <Text style={{fontSize: showExerciseName ? 25 : 15, color: 'black'}}>{showExerciseName ? exerciseLog.name : getDayInfoComparedToToday(exerciseLog.date)}</Text>

                        <View style={{display: 'flex', flexDirection: "row", justifyContent: 'space-between', width: "55%"}}>
                            <Text style={{fontSize: 17, color: 'black'}}>{reducedExerciseSets?.length ? reducedExerciseSets.length + " sets" : "no sets"}</Text>
                        </View>
                        
                    </View>
                    <Icon name={isExerciseSelected ? "chevron-down" : "chevron-right"} size={30} style={{marginRight: 20}}/>
                </View>
            </Pressable>
            { isExerciseSelected && 
                <View style={{backgroundColor: cardColor, borderBottomWidth: isExerciseSelected ? 0 : 1, padding: 10, borderRadius: 10, margin: 5}}>
                    <Heading size="sm">Sets</Heading>
                    { reducedExerciseSets.map((set, index) => {
                                
                                if(!set || !set?.weight || !set?.reps)
                                    return <></>
                                
                                return (
                                    <View style={{display: 'flex', flexDirection: "row", justifyContent: "space-between", alignItems: 'center', heigth: 25}} key={"exercise-history-card-" + index}>
                                        <View style={{display: 'flex', flexDirection: "row"}}>
                                            <Text style={{fontWeight: "bold", fontSize: 17, color: 'black'}}>{set?.weight}</Text>
                                            <Text style={{fontSize: 17, color: 'black'}}>  x  </Text>
                                            <Text style={{fontWeight: "bold", fontSize: 17, color: 'black'}}>{set?.reps}</Text>
                                        </View>
                                    </View>
                                )
                            })}
                </View>
            }
        </View>
    )
}

export { ExerciseLogCard };