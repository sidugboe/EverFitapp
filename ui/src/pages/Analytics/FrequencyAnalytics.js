import React, { useState } from "react";
import { Center, View, VStack, Text, HStack, Box } from 'native-base';
import Body from 'react-native-body-highlighter'
import { useWorkoutLogs } from "../../services/workoutLogService";
import FrequencyHeatMap from "./FrequencyHeatMap";
import { useAuth } from "../../services/authService";
import LinearGradient from 'react-native-linear-gradient';
import { diagramMap, isWithinLastXDays } from "./AnalyticsUtils";

const heatColours= ['#0044a4', '#1f4093', '#423b7f', '#68356a', '#8b3056', '#af2a42', '#d0252f']

const FrequencyAnalytics = () => {
    const { user } = useAuth();
    const { workoutLogs } = useWorkoutLogs(user._id);
    
    const generateWorkoutVolume = () => {
        let logDistribution = [0,0,0,0,0,0]
        workoutLogs.forEach((log) => {
            if(isWithinLastXDays(180, log.date)){
                let lastSixMonths = [];
                for (let i = 6; i > 0; i--) {
                    let monthIndex = new Date().getMonth() - i;
                    monthIndex<0?monthIndex += 12:{};
                    lastSixMonths.push(monthIndex+1);
                }
                logDistribution[lastSixMonths.indexOf(new Date(log.date).getMonth())] += 1;
            }
        })
        return(
            <View borderWidth={1} rounded={10} my='2' alignItems='center'>
                <Text fontSize='3xl' fontWeight='bold'>Workout Volume</Text>   
                <Text fontSize='md' fontWeight={300} color="muted.500">Over the past 6 months</Text>                             
                <FrequencyHeatMap dataInput={logDistribution}/>
            </View>
        )
    }
    
    const generateWorkoutAnalytics = () => {
        let workoutsInLast30 = 0; 
        workoutLogs?.forEach((log) => { //find workouts from last 30 days
            if(isWithinLastXDays(30, log.date))
                workoutsInLast30++;
        })
        let workoutsPerRestDay  = (workoutsInLast30/(30-workoutsInLast30)).toFixed(2) //
        return(
            <View borderWidth={1} rounded={10} my='2' p='2' alignItems='center'>
                <Text fontSize='3xl' fontWeight='bold'>Last 30 Days</Text>
                <HStack justifyContent='space-around' width='100%' mt='3'>
                    <VStack alignItems='center'>
                        <Text fontSize='lg' fontWeight={300}># of Workouts:</Text>
                        <View rounded="full" borderWidth={0} borderColor='blue.500' p='2'>
                            <Text fontSize='3xl' fontWeight={800} color='blue.500'>{workoutsInLast30}</Text>
                        </View>
                    </VStack>
                    <VStack alignItems='center'>
                        <Text  fontSize='lg' fontWeight={300}>Workouts per rest day: </Text>
                        <View rounded="full" borderWidth={0} borderColor='blue.500' p='2'>
                            <Text fontSize='3xl' fontWeight={800} color='blue.500'>{workoutsPerRestDay}</Text>
                        </View>
                    </VStack>
                </HStack>  
            </View>
        )
    }

    const getAllExerciseLogs = () => { //gets all exercise logs in users history
        let totalExLogs = [];
        workoutLogs?.forEach((workoutLog) => {
            (workoutLog.exerciseLogs)?.forEach((exerciseLog) => {
                totalExLogs.push(exerciseLog);
            })
        })
        return totalExLogs;
    }

    const renderMuscleGroupHeatmap = () => { //heatmap by muscle group
        let muscleGroupMap = new Map(); //create map k/v pair for each possible muscle
        const muscleGroupAreas = Array.from(diagramMap.keys()) 
        muscleGroupAreas?.forEach((muscle) => { muscleGroupMap.set(muscle, 0)}) //create k/v pair for each muscle group
        getAllExerciseLogs()?.map((exLog) => { //count occurances of each muscle in every exercise log
            exLog.muscleGroup?.map((muscleGroup) => { //looks for muscle groups
                muscleGroupMap.set(muscleGroup, (muscleGroupMap.get(muscleGroup)+1))
            })
        })
        let mostWork = -1;        
        (muscleGroupMap)?mostWork = Math.max(...muscleGroupMap.values()):{}; //find most worked muscle (max heat)
        for(x of muscleGroupAreas){
            let heatIntensity = Math.floor(muscleGroupMap.get(x)/mostWork*heatColours.length) //readjust intensity 
            if(heatIntensity<1 && heatIntensity>0) //make usre muscles are not neglected due to rounding
                heatIntensity = 1;
            muscleGroupMap.set(x , heatIntensity)
        }
        const muscleData = [];
        for(mg of muscleGroupAreas){ //iterate through all muscle groups
            if(muscleGroupMap.get(mg) > 0){ //set the intensity for each muscle in the muscle group
                for(muscleHighlight of diagramMap.get(mg)){
                    muscleData.push({slug: muscleHighlight, intensity: muscleGroupMap.get(mg)})
                }
            }
        } 
        if(muscleData != undefined || mostWork < 0){
            return(
                <View borderWidth={1} rounded={10} my='2' alignItems='center'>
                    <Text fontSize='3xl' fontWeight='bold'>Training Distribution</Text>
                    <Text fontSize='md' fontWeight={300} color="muted.500">Heatmap Reference</Text> 
                    <Center width='100%' my='2'>
                        <LinearGradient 
                            colors={['#0044a4', '#68356a', '#d0252f']} 
                            start={{x: 0, y: 0.5}}
                            end={{x: 1, y: 0.5}}
                            style={{flex: 1, width: '75%', height: 20, borderWidth:1}} 
                        />
                        <HStack justifyContent='space-around' width='100%'> 
                            <Text>Least Used</Text>   
                            <Text>Most Used</Text>    
                        </HStack>                            
                    </Center>
                    <Body data={muscleData} colors={heatColours} scale={1.3}/>
                </View>
            )
        }
        else
            return(<Text color='red.300' fontSize='xl'>No data available</Text>)
    }

    const renderMuscleHighlightHeatmap = () => { //heatmap by muscle highlight
        let muscleMap = new Map(); //create map k/v pair for each possible muscle
        const muscleHighlightAreas = ['trapezius','upper-back','lower-back','chest','biceps','triceps','forearm','back-deltoids','front-deltoids','abs','obliques','adductor','hamstring','quadriceps','abductors','calves','gluteal','head','neck'];
        
        muscleHighlightAreas?.forEach((muscle) => {
            muscleMap.set(muscle, 0)
        })
        
        muscleHighlightAreas?.forEach((muscle) => {
            muscleMap.set(muscle, 0)
        })
    }

    return(
        <View width='95%' minH='200' my='2'rounded="25" borderWidth="1" borderColor="coolGray.300" shadow="3" bg="coolGray.50">
            <Center>
                <Text fontSize='lg' fontWeight={300} m='2'>Consistency Analysis</Text>
                <View width='90%'>{generateWorkoutVolume()}</View>
                <View width='90%'>{generateWorkoutAnalytics()}</View>
                <View width="90%">{renderMuscleGroupHeatmap()}</View>
            </Center>
        </View>
    )
}

export {FrequencyAnalytics};