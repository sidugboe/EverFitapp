import React, { useState,useEffect } from 'react';
import { Box, Text, ScrollView, Center, Input, Select, Pressable, Button, View, CheckIcon, Spinner } from "native-base";
import { WhiteGreyBlackPicker } from '../../components/formItems/WhiteGreyBlackPicker';
import { useMedia  } from '../../services/mediaService';
import { useWorkouts } from '../../services/workoutService';
import { useExercises } from '../../services/exerciseService';
import { TrainingItemImagePicker } from '../../components/formItems/TrainingItemImagePicker';

function WorkoutCreator ({ navigation, route}) {
    const [allExercises, setAllExercises] = useState([]);
    const [filteredExercises, setFilteredExercises] = useState([]);
    const [selectedDisplayTextColor, setSelectedDisplayTextColor] = useState("black")
    const [image, setImage] = useState()
    const [isLoading, setIsLoading] = useState(false)

    const { exercises: exerciseRecords, createExercise, refetchExercises, deleteExercise } = useExercises();
    const { workouts, createWorkout, refetchWorkouts, editWorkout } = useWorkouts();
    const { uploadImage } = useMedia();

    useEffect(() => {
        setAllExercises(exerciseRecords);
        setFilteredExercises(exerciseRecords);
        setExercises([])
        }, [exerciseRecords])

    const [name, setName] = useState([]);
    const [description, setdescription] = useState();
    const [attachment, setAttachment] = useState();
    const [muscleGroup, setMuscleGroup] = React.useState([]);
    const [exercises,setExercises] = useState([]);

    const handleNameChange = text => {setName(text)}
    const handleDescriptionChange = text => {setdescription(text)}
    const handleAttachmentChange = text => {setAttachment(text)}

    const onCardPress = (exerciseID, exerciseName) => {
        if(exercises.length == 0)
            setExercises([{exID: exerciseID, exName: exerciseName}])
        else
            setExercises([...exercises, {exID: exerciseID, exName: exerciseName}]);        
    }

    const getExerciseSummaries = () => {
        return(filteredExercises?.map((exercise, index) => {
            return(
                <Pressable onPress={() => onCardPress(exercise._id, exercise.name)} key={'exercise' + index} maxW="96" my='1' >
                    {({ isHovered, isFocused, isPressed}) => {
                        return(
                            <Box bg={isPressed ? "coolGray.200" : isHovered ? "coolGray.200" : "coolGray.100"} 
                            style={{transform: [{scale: isPressed ? 0.96 : 1}]}} 
                            p="5" rounded="8" shadow={1} borderWidth="1" borderColor="coolGray.300">
                                <Text color="coolGray.900" mt="1" fontWeight="medium" fontSize="xl">
                                    {exercise.name}
                                </Text>
                                <Text color="coolGray.500" mt="1" fontSize="sm">
                                    {exercise._id}
                                </Text>
                            </Box>
                        )                       
                    }}
                </Pressable>
            )
        }))   
    }

    const filterExercises = exerciseQuery => {
        if (exerciseQuery == "" || exerciseQuery == null || filteredExercises.length === 0)
            setFilteredExercises(allExercises)
        else {
            let searchResults = [];;
            allExercises.forEach((ex) => {
                if(ex.name.includes(exerciseQuery))
                    searchResults.push(ex)
            })
            setFilteredExercises(searchResults)
        }
    }

    const showPreview = () => {
        if(exercises == null || exercises == undefined || exercises.length == 0){
            return(
                <View width='100%' borderWidth='1' borderColor='green.700' borderRadius='md' p={5}>
                    <Center>
                        <Text fontWeight={600} color="muted.500">Select exercises to add to your workout!</Text>
                    </Center>
                </View>
            )
        }
        else if (exercises.length > 0){
            return(
                <View width='100%' borderWidth='1' borderColor='green.700' borderRadius='md' p={5}>
                    {exercises?.map((exercise, index) => {
                    return(<Text fontSize="lg" key={index}>Exercise {index+1}: {exercise.exName}</Text>)
                })}</View>
            )
        }
        else
            return(null)
    }

    const manageSubmitButton = () => {
        if(name.length < 1){
            return(
                <View>
                    <Button onPress={()=>onSubmit()} m='5' backgroundColor='green.500' isDisabled>Save</Button>
                    <Text color='red.500' mb='2'>Please enter a name</Text>
                </View>
            )
        }
        else if(muscleGroup.length < 1){
            return(
                <View>
                    <Button onPress={()=>onSubmit()} m='5' backgroundColor='green.500' isDisabled>Save</Button>
                    <Text color='red.500' mb='2'>Please select a muscle group</Text>
                </View>
            )
        }
        else
            return(
                <Button backgroundColor='green.500' my={3} width="120" onPress={() => onSubmit()}>
                { isLoading ? 
                    <Spinner size="sm" />
                :
                    <Text style={{color: "white"}}>Create Workout</Text>
                }
                </Button>
            )
    }

    const onSubmit = async () => {
        setIsLoading(true);

        const exercisesOutput = exercises?.map((ex) => {
            return ex.exID
        })

        let imageUrl;
        if(image){
            // upload the image and get the image url
            let uploadUrl = await uploadImage(image);

            // remove tinformaiton from end of image url
            imageUrl = uploadUrl.split("?")[0]
        }

        let workoutJSON = {
            name: name,
            muscleGroup: muscleGroup,
            exerciseTemplates: exercisesOutput,
            description: description,
            attachments: image ? [imageUrl] : [],
            textColor: selectedDisplayTextColor
        }

        await createWorkout(workoutJSON);

        // navigate to routines page
        navigation.navigate("Routines")
    }

    const onDisplayTextColorChange = (color) => {
        setSelectedDisplayTextColor(color)
    }

    return(
        <ScrollView>
            <Center>
                <Box bg='green.700' m='3' px='12' py='8' borderRadius='xl'>
                    <Text fontSize='3xl' fontWeight='bold' color='white'>Create Workout</Text>
                </Box>
            </Center>

            <Text underline mx='5' mt='5'>Workout Name</Text>
            <Input onChangeText={handleNameChange} 
                size="md" py='3' my='3'mx='5'
                placeholder={"Insert Name Here"} >
            </Input>

            <Text underline mx='5' mt='5'>Display Text Color</Text>
            <WhiteGreyBlackPicker selectedColor={selectedDisplayTextColor} onColorChange={onDisplayTextColorChange}/>

            <Text underline mx='5' mt='5'>Display Image</Text>
            <TrainingItemImagePicker image={image} setImage={setImage} selectedTextColor={selectedDisplayTextColor} type="workout" itemChildren={exercises} itemName={name} itemDescription={description}/>

            <Text underline mx='5' mt='5'>Workout Description</Text>
            <Input 
                onChangeText={handleDescriptionChange} 
                size="md" py='3' my='3'mx='5'
                placeholder={"Provide a high level description of your workout"}>
            </Input>

            <Select selectedValue={muscleGroup} 
                    minWidth="200" accessibilityLabel="Choose Muscle Group" 
                    placeholder="Choose Muscle Group" 
                    _selectedItem={{bg: "teal.600",endIcon: <CheckIcon size="5" />}} 
                    m={4} mb={6}
                    onValueChange={itemValue => setMuscleGroup(itemValue)}>
                <Select.Item label="Arms" value="arms" />
                <Select.Item label="Back" value="back" />
                <Select.Item label="Chest" value="chest" />
                <Select.Item label="Core" value="core" />
                <Select.Item label="Hip" value="hip" />
                <Select.Item label="Legs" value="legs" />
                <Select.Item label="Shoulder" value="shoulder" />
            </Select>

            <Text underline mx='5' mt='5'>Workout Attachement</Text>
            <Input 
                onChangeText={handleAttachmentChange} 
                size="md" py='3' my='3'mx='5'
                placeholder={"Upload media related to the workout as a whole"}>
            </Input>

            <Text underline mx='5' mt='5'>Select Exercises</Text>
            <Center>
                <Input 
                    onChangeText={filterExercises} 
                    size="md" mx='5' my='2' width='80%'
                    placeholder={"Search for an exercise"}/>
                <ScrollView nestedScrollEnabled = {true} 
                    mx={10} p={5} height={300} width='80%' 
                    borderWidth='1' borderRadius='md' borderColor='muted.500'>{getExerciseSummaries()}
                </ScrollView>
            </Center>            

            <Center>
                <Box bg='green.700' m='3' px='12' py='8' borderRadius='xl'>
                    <Text fontSize='3xl' fontWeight='bold' color='white'>{name} Preview</Text>
                </Box>
                <Box width='80%'>{showPreview()}</Box>
                {manageSubmitButton()}
            </Center>
            
        </ScrollView>
    )
}

export default WorkoutCreator;
