import React, { useState,useEffect } from 'react';
import { Box, Text, ScrollView, Center, Input, Select, Pressable, Button, View, Spinner, Slider } from "native-base";
import { WhiteGreyBlackPicker } from '../../components/formItems/WhiteGreyBlackPicker';
import { useWorkouts } from '../../services/workoutService';
import { useRoutines } from '../../services/routineService';
import { TrainingItemImagePicker } from '../../components/formItems/TrainingItemImagePicker';
import { useMedia } from '../../services/mediaService';

function RoutineCreator({ navigation, route}) {
    const [name, setName] = useState([]);
    const [description, setDescription] = useState();
    const [attachment, setAttachment] = useState([]);
    const [numDays, setNumDays] = useState(3);
    const [workoutTemplates, setWorkoutTemplates] = useState([]);
    const [selectedDisplayTextColor, setSelectedDisplayTextColor] = useState("black")
    const [image, setImage] = useState()
    const [isLoading, setIsLoading] = useState(false)

    const handleNameChange = (nameUpdate) => {setName(nameUpdate)}
    const handleDescriptionChange = (descriptionUpdate) => {setDescription(descriptionUpdate)}
    const handleAttachmentChange = (attachmentUpdate) => {setAttachment(attachmentUpdate)}

    const [allWorkouts, setAllWorkouts] = useState([]);
    const [filteredWorkouts, setFilteredWorkouts] = useState([]);

    const { workouts: workoutIngress, createWorkout, refetchWorkouts, editWorkout } = useWorkouts();
    const { routines, createRoutine, refetchRoutines, editRoutine} = useRoutines();
    const { uploadImage } = useMedia()

    useEffect(() => {
        setAllWorkouts(workoutIngress);
        setFilteredWorkouts(workoutIngress);
        }, [workoutIngress])

    const filterWorkouts = (queryString) => {
        if (queryString == "" || queryString == null || filteredWorkouts.length === 0)
            setFilteredWorkouts(allWorkouts)
        else {
            let searchResults = [];
            allWorkouts.forEach((wo) => {
                if(wo.name.includes(queryString))
                    searchResults.push(wo)
            })
            setFilteredWorkouts(searchResults)
        }
    }

    const onCardPress = (WorkoutID, WorkoutName) => {
        if(workoutTemplates.length == 0)
            setWorkoutTemplates([{woID: WorkoutID, woName: WorkoutName}])
        else
            setWorkoutTemplates([...workoutTemplates, {woID: WorkoutID, woName: WorkoutName}]);        
    }

    const getWorkoutSummaries = () => {
        return(filteredWorkouts?.map((wo, index) => {
            return(
                <Pressable onPress={() => onCardPress(wo._id, wo.name)} key={'workout' + index} maxW="96" my='1' >
                    {({ isHovered, isFocused, isPressed}) => {
                        return(
                            <Box bg={isPressed ? "coolGray.200" : isHovered ? "coolGray.200" : "coolGray.100"} 
                            style={{transform: [{scale: isPressed ? 0.96 : 1}]}} 
                            p="5" rounded="8" shadow={1} borderWidth="1" borderColor="coolGray.300">
                                <Text color="coolGray.900" mt="1" fontWeight="medium" fontSize="xl">
                                    {wo.name}
                                </Text>
                                <Text color="coolGray.500" mt="1" fontSize="sm">
                                    {wo._id}
                                </Text>
                            </Box>
                        )                       
                    }}
                </Pressable>
            )
        }))  
    }

    const showPreview = () => {
        if(workoutTemplates == null || workoutTemplates == undefined || workoutTemplates.length == 0){
            return(
                <View width='100%' borderWidth='1' borderColor='amber.700' borderRadius='md' p={5}>
                    <Center>
                        <Text fontWeight={600} color="muted.500">Select exercises to add to your workout!</Text>
                    </Center>
                </View>
            )
        }
        else if (workoutTemplates.length > 0){
            return(
                <View width='100%' borderWidth='1' borderColor='amber.700' borderRadius='md' p={5}>
                    {workoutTemplates?.map((workout, index) => {
                    return(<Text fontSize="lg" key={'wo'+index}>Workout {index+1}: {workout.woName} </Text>)
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
                    <Button onPress={()=>onSubmit()} m='5' backgroundColor='amber.500' isDisabled>Save</Button>
                    <Text color='red.500' mb='2'>Please enter a name</Text>
                </View>
            )
        }
        else
            return(
                <Button backgroundColor='amber.500' my={3} width="120" onPress={() => onSubmit()}>
                { isLoading ? 
                    <Spinner size="sm" />
                :
                    <Text style={{color: "white"}}>Create Routine</Text>
                }
                </Button>
            )
    }

    const onSubmit = async () => {
        setIsLoading(true)
        const wokroutTemplatesParsed = workoutTemplates?.map((workoutA) => {
            return workoutA.woID
        })

        let imageUrl;
        if(image){
            // upload the image and get the image url
            let uploadUrl = await uploadImage(image);

            // remove tinformaiton from end of image url
            imageUrl = uploadUrl.split("?")[0]
        }

        const routineJSON = {
            name: name,
            description: description,
            numberOfDays: numDays,
            workoutTemplates: wokroutTemplatesParsed,
            textColor: selectedDisplayTextColor,
            attachments: image ? [imageUrl] : []
        }

        await createRoutine(routineJSON);

        // navigate to routines page
        navigation.navigate("Routines")
    }

    const onDisplayTextColorChange = (color) => {
        setSelectedDisplayTextColor(color)
    }

    return(
        <ScrollView>
            <Center>
                <Box bg='amber.700' m='3' px='12' py='8' borderRadius='xl'>
                    <Text fontSize='3xl' fontWeight='bold' color='white'>Create Routine</Text>
                </Box>
            </Center>

            <Text underline mx='5' mt='5'>Routine Name</Text>
            <Input onChangeText={handleNameChange} 
                size="md" py='3' my='3'mx='5'
                placeholder={"Insert Name Here"} >
            </Input>

            <Text underline mx='5' mt='5'>Display Text Color</Text>
            <WhiteGreyBlackPicker selectedColor={selectedDisplayTextColor} onColorChange={onDisplayTextColorChange}/>

            <Text underline mx='5' mt='5'>Display Image</Text>
            <TrainingItemImagePicker image={image} setImage={setImage} selectedTextColor={selectedDisplayTextColor} type="routine" itemChildren={numDays} itemName={name} itemDescription={description}/>

            <Text underline mx='5' mt='5'>Routine Description</Text>
            <Input onChangeText={handleDescriptionChange} 
                size="md" py='3' my='3'mx='5'
                placeholder={"Insert Name Here"}>
            </Input>

            <Text underline mx='5' mt='5'>Routine Attachement</Text>
            <Input onChangeText={handleAttachmentChange} 
                size="md" py='3' my='3'mx='5'
                placeholder={"Insert Name Here"}>
            </Input>

            <Text underline mx='5' mt='5'>Set Routine Cycle Length (Days)</Text>
            <Center>
                <Slider w="3/4" maxW="300" mt='3' colorScheme="amber"
                    defaultValue={numDays} minValue={0} maxValue={14} step={1} 
                    onChange={v => {setNumDays(Math.floor(v));}} 
                    >
                    <Slider.Track>
                        <Slider.FilledTrack />
                        </Slider.Track>
                    <Slider.Thumb />
                </Slider>
                <Text>Cycle Length: {numDays}</Text>
            </Center>

            <Text underline mx='5' mt='5'>Select Workouts</Text>
            <Center>
                <Input 
                    onChangeText={filterWorkouts} 
                    size="md" mx='5' my='2' width='80%'
                    placeholder={"Search for a Workout"}/>
                <ScrollView nestedScrollEnabled = {true} 
                    mx={10} p={5} height={300} width='80%' 
                    borderWidth='1' borderRadius='md' borderColor='muted.500'>{getWorkoutSummaries()}
                </ScrollView>
            </Center> 
            
            <Center>
                <Box bg='amber.700' m='3' px='12' py='8' borderRadius='xl'>
                    <Text fontSize='3xl' fontWeight='bold' color='white'>{name} Preview</Text>
                </Box>
                <Box width='80%'>{showPreview()}</Box>
                {manageSubmitButton()}
            </Center>
        </ScrollView>
    )
}

export default RoutineCreator;