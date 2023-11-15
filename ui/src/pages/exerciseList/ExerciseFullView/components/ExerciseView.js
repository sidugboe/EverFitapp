import React, { useState , useRef , useEffect} from "react";
import { Button, Box, Text, HStack , ScrollView } from "native-base";
import BodyDiagram from "./BodyDiagram";
import { useExercises } from '../../../services/exerciseService';

function ExerciseView(props) {
    const { navigation, route} = props

    const onButtonPress = () => {
        navigation.navigate("EditExercise", {exercise: props?.exercise});
    }

    return (
        <Box>
            <ScrollView>
                <Box m='4' borderWidth='2' borderRadius='md' borderColor={'black'} p='5'>
                    <HStack justifyContent='space-between'>
                      <Text alignText='left' fontSize='lg' color='muted.500'>Exercise {props.exerciseNum}</Text>
                        <Button onPress={() => onButtonPress()}>Edit</Button>
                    </HStack>
                    <Text fontSize='5xl' fontWeight='bold'>{props.exercise.name}</Text>
                    <Text mt='2'>{props.exercise.description}</Text>
                    <BodyDiagram muscles={props.exercise.muscleHighlight}></BodyDiagram>
                </Box>  
            </ScrollView>
        </Box>
    )
}

export default ExerciseView;