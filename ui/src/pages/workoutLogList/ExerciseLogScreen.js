import React, { useState, useEffect } from "react";
import { Center, Button, View, ScrollView, Text, Pressable} from 'react-native';
import { useExerciseLogs } from "../../services/exerciseLogService";
import { useWorkoutLogs } from "../../services/workoutLogService";
import { useExerciseSetLogs } from "../../services/exerciseSetLogService";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from "../../services/authService";
import { ExerciseLogCard } from "./ExerciseLogCard";
import { Heading } from "native-base";

const ExerciseLogScreen  = ({ navigation, route }) => {

    const selectedWorkout = route?.params?.selectedWorkout;

    // hook calls for data
    const { user } = useAuth();
    // const { workoutLogs } = useWorkoutLogs(user._id);
    // const { exerciseLogs } = useExerciseLogs(user._id);

    // component state
    const [selectedExercise, setSelectedExercise] = useState("")

    return (
        <View style={{height: "100%"}}>
            <Heading margin={2} size={"lg"}>{selectedWorkout.name}</Heading>
            { selectedWorkout?.exerciseLogs?.length ? 
                selectedWorkout?.exerciseLogs.map((log, index) => 
                    <ExerciseLogCard key={"exercise-log-" + index} exerciseLog={log} selectedExercise={selectedExercise} setSelectedExercise={setSelectedExercise} />)
            :
            <Text>No exercises here</Text>
            }
        </View>
    )
}

export { ExerciseLogScreen }