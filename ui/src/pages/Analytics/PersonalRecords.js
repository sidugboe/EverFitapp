import React, { useState } from "react";
import { Center, View, VStack, Text, ScrollView, SearchIcon, HStack, Input, Divider } from 'native-base';
import { useAuth } from "../../services/authService";
import { useWorkoutLogs } from "../../services/workoutLogService";
import { useExerciseLogs } from "../../services/exerciseLogService";
import { getOverallExerciseData, maxRepPerExerciseLog } from "./AnalyticsUtils";

const PersonalRecords = () => {
    const { user } = useAuth();
    const { workoutLogs } = useWorkoutLogs(user._id);
    const { exerciseLogs } = useExerciseLogs(user._id)
    const [ queryExercise, setQueryExercise ] = useState("");

    const generateDasboard = () => {
        const { mostCommon, uniqueExercises } = getOverallExerciseData(exerciseLogs)
        return(
            <View borderWidth={1} rounded={10} alignItems='center' py='3' my='2'>
                <Text fontSize='3xl' fontWeight='bold'>My Dashboard</Text>
                    <VStack alignItems='center'>
                        <Text fontSize='lg' fontWeight={300}>You've tried</Text>
                        <Text fontSize='3xl' fontWeight={500} color='blue.500'>{uniqueExercises}</Text>
                        <Text fontSize='lg' fontWeight={300}>different exercises,</Text>
                        <Text fontSize='3xl' fontWeight={500} color='blue.500'>{mostCommon}</Text>
                        <Text  fontSize='lg' fontWeight={300}>is your most common one</Text>
                    </VStack>
            </View>
        )
    }

    const ExerciseRecords = () => {
        return(
            <View borderWidth={1} rounded={10} alignItems='center' py='3'>
                <Text fontSize='lg' fontWeight={300}>Search for a Personal Record</Text>
                <HStack alignItems='center' justifyContent='space-around' py='2'>
                    <SearchIcon size='xl'/>
                    <Input 
                        onChangeText={text => setQueryExercise(text)} 
                        placeholder="Search for an exercise" 
                        size="md" width='70%' ml='3'
                    />
                </HStack>
                <ScrollView width='90%' borderWidth={1} rounded={10} minH={100}>
                    {personalRecordSearch()}
                </ScrollView>
            </View>
        )
    }

    const personalRecordSearch = () => {
        let exMax = new Map(); //map of exercises and PR
        exerciseLogs?.forEach((element) => {
            if(exMax.has(element.name))
                exMax.set(element.name, Math.max(exMax.get(element.name), maxRepPerExerciseLog(element)));
            else
                exMax.set(element.name, maxRepPerExerciseLog(element));
        })
        let  recordsList = Array.from(exMax.keys()) 

        if (queryExercise != "" || queryExercise != null){
            recordsList = recordsList.filter(x => x.includes(queryExercise))
        }

        return(
            recordsList?.map((exercise, index) => {
                if(exMax.get(exercise) < 1){
                    return(<View></View>)
                }
            return(
                <View alignItems='center' key={'record'+index}>
                    <HStack width='100%' p='3' justifyContent='space-between' key={'p'+index} alignItems='baseline'>
                        <Text fontSize='lg' fontWeight={300}>{exercise}</Text>
                        <Text fontSize='3xl' fontWeight={500}>{exMax.get(exercise)}</Text>
                    </HStack>
                    <Divider width="90%"/>
                </View>
            )    
        }))
    };

    return(
        <View width='95%' minH='200' my='2' py='2' rounded="25" borderWidth="1" borderColor="coolGray.300" shadow="3" bg="coolGray.50">
            <Center>
                <Text fontSize='lg' fontWeight={300} m='2'>Personal Records</Text>
                <View width='90%'>{generateDasboard()}</View>
                <View width='90%'>{ExerciseRecords()}</View>
            </Center>
        </View>
    )
}

export { PersonalRecords };