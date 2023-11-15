import React from "react";
import { Text, View, Pressable } from 'react-native';
import { useExerciseLogs } from "../../services/exerciseLogService";
import { useWorkoutLogs } from "../../services/workoutLogService";
import { useExerciseSetLogs } from "../../services/exerciseSetLogService";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDayInfoComparedToToday } from "../../utils/helpers/dateHelper";

const ExerciseHistoryCard = ({ exerciseLog, selectedExercise, setSelectedExercise }) => {

    isExerciseSelected = selectedExercise === exerciseLog._id

    const onExerciseLogPress = () => {
        setSelectedExercise(prev => prev == exerciseLog._id ? "" : exerciseLog._id)
    }

    return (
        <>
        <View style={{backgroundColor: "#E8E8E8", borderRadius: 4, marginBottom: 3}}>
            <Pressable onPress={onExerciseLogPress}>
                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 4}}>

                        <View style={{display: 'flex', flexDirection: "column", justifyContent: 'flex-start', width: "100%"}}>
                            { exerciseLog?.sets?.filter(x => x ? true : false).map((set, index) => {
                                
                                if(!set || !set?.weight || !set?.reps)
                                    return <></>
                                
                                return (
                                    <View style={{display: 'flex', flexDirection: "row", justifyContent: "space-between", alignItems: 'center'}} key={"exercise-history-card-" + index}>
                                        <View style={{display: 'flex', flexDirection: "row"}}>
                                            <Text style={{fontWeight: "bold", fontSize: 17}}>{set?.weight}</Text>
                                            <Text style={{fontSize: 17}}>  x  </Text>
                                            <Text style={{fontWeight: "bold", fontSize: 17}}>{set?.reps}</Text>
                                        </View>
                                        { index == 0 &&
                                            <View style={{display: 'flex', flexDirection: "row"}}>
                                                <Text style={{marginRight: 10}}>{getDayInfoComparedToToday(exerciseLog?.date)}</Text>
                                                <Icon name={isExerciseSelected ? "chevron-down" : "chevron-right"} size={20} style={{marginRight: 20}}/>
                                            </View>
                                        }
                                    </View>
                                )
                            })}
                        </View>
                        
                    </View>
            </Pressable>
        </View>
        { isExerciseSelected && 
            <View style={{backgroundColor: "#E8E8E8", borderRadius: 4, marginBottom: 3, height: "2%"}}>
                <View style={{height: "100%", marginHorizontal: 10, marginVertical: 5}}>
                    <Text>More info or link to workout here</Text>
                </View>
             </View>
        }
        </>
    )
}

export { ExerciseHistoryCard };