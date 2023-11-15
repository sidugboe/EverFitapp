import React, { useState, useEffect } from "react";
import { HStack, View, Center, Pressable, Text, Image } from 'native-base';

function CreateBar (props){
    const navigation = props.nav
    
    const onRoutinePress = () => {
        navigation.navigate("AddRoutine", {});
    }
    const onWorkoutPress = () => {
        navigation.navigate("AddWorkout", {});
    }
    const onExercisePress = () => {
        navigation.navigate("AddExercise", {});
    }

    return(
        <View my='4' py='2'borderRadius='8'>            
            <HStack >
                
                <Pressable onPress={onRoutinePress} rounded="8" overflow="hidden" borderWidth="1" borderColor="coolGray.300" maxW="96" shadow="3" bg="coolGray.100" p="2" m='1'>
                    <Center>
                        <Image source={require('../../../assets/images/create-routine.png')} alt="Alternate Text" size="lg" />
                        <Text color="coolGray.800" mt="1" fontWeight="medium" fontSize="md">
                            Create Routine
                        </Text>
                    </Center>
                </Pressable>
                <Pressable onPress={onWorkoutPress} rounded="8" overflow="hidden" borderWidth="1" borderColor="coolGray.300" maxW="96" shadow="3" bg="coolGray.100" p="2" m='1'>
                    <Center>
                        <Image source={require('../../../assets/images/create-workout.jpg')} alt="Alternate Text" size="lg" />
                        <Text color="coolGray.800" mt="1" fontWeight="medium" fontSize="md">
                            Create Workout
                        </Text>
                    </Center>
                </Pressable>
                <Pressable onPress={onExercisePress} rounded="8" overflow="hidden" borderWidth="1" borderColor="coolGray.300" maxW="96" shadow="3" bg="coolGray.100" p="2" m='1'>
                    <Center>
                        <Image source={require('../../../assets/images/create-exercise.jpg')} alt="Alternate Text" size="lg" />
                        <Text color="coolGray.800" mt="1" fontWeight="medium" fontSize="md">
                            Create Exercise
                        </Text>
                    </Center>
                </Pressable>
            </HStack> 
        </View>
        

        
    )
}

function LibraryPressable (props) {
    const onLibraryPress = () => {
        props.inputFunction()
    }

    return(
        <Center my='4'>
            <Pressable onPress={onLibraryPress} rounded="8" overflow="hidden" borderWidth="1" borderColor="coolGray.300" maxW="96" shadow="3" bg="coolGray.100" p="2" m='1'>
                <HStack>
                    <Image source={require('../../../assets/images/library-cover.jpg')} alt="123" height={100} width={300}/>
                    <View flexDirection='row' alignItems='center'>
                        <Text color="coolGray.800" m="2" fontWeight="medium" fontSize="md" maxW={100}>Training Library</Text>
                    </View>
                </HStack>
            </Pressable>
        </Center>
        
    )
}

export { CreateBar, LibraryPressable };