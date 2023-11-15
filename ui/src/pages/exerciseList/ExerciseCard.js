import React, { useContext, useState, useEffect, useRef } from "react";
import { Text, TextInput, TouchableOpacity, View, Pressable } from 'react-native';
import { Box, AspectRatio, Image, Center, Heading, DeleteIcon, ChevronDownIcon, ChevronUpIcon, Stack, HStack} from 'native-base';
import { Button, Input, InputLeftAddon, InputGroup, InputRightAddon, Select, CheckIcon } from 'native-base';
import { useExerciseLogs } from "../../services/exerciseLogService";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const WEIGHT_UNITS = "lbs"

const ExerciseCard = ({exercise, navigation, isEditMode, onDelete, onMoveDown, onMoveUp, isWorkoutInProgress, exerciseInProgress, setExerciseInProgress, exerciseLogs, setExerciseLogs, startRestTimer, onToggleComments, setChangesMadeToWorkout, setCanSave, openExerciseHistory }) => {
  
    // component state
    const [currentExerciseSetLogs, setCurrentExerciseSetLogs] = useState(Array(exercise.sets?.length).fill(undefined));   // logs for sets of the current exercise (not including sets from previous executions). Initalized to { undefined, undefined, undefined, ... } for however many sets in the exercise untiluser creates a set log for each swet (based on order)
    const [additionalSets, setAdditionalSets] = useState([]);   // logs for additional sets
    const [isSetTypeInputPending, setIsSetTypeInputPending] = useState(false);
    const [hasTimerStartedForSets, setHasTimerStartedForSets] = useState([]);   // array of boolean values for each set set to true when the timer is started for a set so they are not consttantly restarted on input
    const [changesMadeToExercise, setChanesMadeToExercise] = useState(false)
    const [setLogsFromPreviousWorkout, setSetLogsFromPreviousWorkout] = useState([])

    // hook calls
    const { exerciseLogs: exerciseLogRecords, isLoading: isLoadingExerciseLogs } = useExerciseLogs();

    // local variable for better readability
    let isExerciseInProgress = exerciseInProgress === exercise?.name;

    // once we have logs filter to find previous set values
    useEffect(() => {
        if(!isLoadingExerciseLogs){
            if(exerciseLogRecords.length){
                let exerciseLogsForThisExercise = exerciseLogRecords.filter(exerciseLog => exerciseLog.exerciseId?.toString() === exercise?._id?.toString())

                // set logs from previous workout todo add logic to back fill in case we didn't do all of the sets last time 
                setSetLogsFromPreviousWorkout(exerciseLogsForThisExercise[0]?.sets)
            }
        }
    }, [isLoadingExerciseLogs])

    useEffect(() => {
        if(exercise?.sets?.length){
            // setExerciseSets(allExerciseSets)
            setHasTimerStartedForSets(exercise?.sets?.map(item => false))
        }

    }, [exercise?.sets])

    useEffect(() => {
        // if another exercise has been started and something has been changed with this one, save
        // this also covers case when exerciseInProgress is set to finishing while this one is open - it wil save becuase exerciseInProgress will be "finish"
        if(!isExerciseInProgress && (currentExerciseSetLogs?.length || additionalSets?.length)){
            
            // format exercise logs to send back to parent (exercise log including set logs)
            let exerciseLog = {
                exerciseTemplate: exercise._id,
                name: exercise.name,
                // notes: exerciseNotes,
                sets: currentExerciseSetLogs,
                // muscle: exercise.muscle,
                // muscleHighlight: exercise.muscleHighlight,
                muscleGroup: exercise.muscleGroup,
                description: exercise.description,
                type: exercise.type,
            }

            // update parent state so that data will be saved on finish
            let updatedExerciseLogs = [];
            let exerciseLogAlreadyCreated = false; // whether we've already setup a log for this exrcise and we need to update it
            for(let log of exerciseLogs){
                if(log?.exerciseTemplate?.toString() == exercise?._id?.toString()){
                    updatedExerciseLogs.push(exerciseLog) // update the log for this exercise if it has already been added
                    exerciseLogAlreadyCreated = true;
                }
                else {
                    updatedExerciseLogs.push(log) // else it is not this exercise don't change it
                }
            }

            // AND if we didn't update one, then we have to add it
            if(!exerciseLogAlreadyCreated)
                updatedExerciseLogs.push(exerciseLog)

            setExerciseLogs(updatedExerciseLogs)

            if(exerciseInProgress === "finish"){
                setCanSave(true);
            }
        }
    }, [isExerciseInProgress])

    useEffect(() => {
        if(changesMadeToExercise)
            setChangesMadeToWorkout(true)
    }, [changesMadeToExercise])

    // when a card is pressed navigate to the corresponding screen
    const onCardPress = () => {
        if(!isEditMode && !isWorkoutInProgress)
                navigation.navigate("Exercise", { exData: exercise});
    }

    const onExecute = () => {
        setExerciseInProgress(exercise?.name);
    }

    const onAddSet = () => {
        // await set type selection
        setIsSetTypeInputPending(true);
    }

    const onAddSetConfirmed = (setType) => {
        let newSets = [...additionalSets]
        newSets.push({reps: "", weight: "", type: setType});
        setIsSetTypeInputPending(false);
        setAdditionalSets(newSets);

        // add timer data for additional set
        setHasTimerStartedForSets(prev => [...prev, false])
    }

    const onSetWeightChange = (value, setTemplate, index) => {
        if(!value)
            return
        
        // tell parent component that something in the workout has been changed so the exit modal will be shown now
        if(!changesMadeToExercise)
            setChanesMadeToExercise(true);

        let newSetLogs = [];
        let setUpdated = false;

        // update the set in the array of sets
        setCurrentExerciseSetLogs(prev => prev.map((set, setIndex) => setIndex === index ? {...set, weight: value, type: setTemplate.type} : set));
    }

    const onSetRepsChange = (value, setTemplate, index) => {
        if(!value)
            return

        let newSetLogs = [];
        let setUpdated = false;

        if(!changesMadeToExercise)
            setChanesMadeToExercise(true)

        // update the set in the array of sets
        setCurrentExerciseSetLogs(prev => prev.map((set, setIndex) => setIndex === index ? {...set, reps: value, type: setTemplate.type} : set));

        // start the timer only if we haven't started it yet (if first time adjusting reps for this set)
        if(!hasTimerStartedForSets[index]){
            setHasTimerStartedForSets(prev => prev.map((value, index) => index === index ? true : value))
            startRestTimer();
        }
    }

    const onAdditionalSetWeightChange = (value, setIndex) => {
        if(!value)
            return

        if(!changesMadeToExercise)
            setChanesMadeToExercise(true)

        let newAdditionalSets = [];
        for(let [index, set] of additionalSets.entries()){
            if(index !== setIndex){
                newAdditionalSets.push(set);
            }
            else {
                // apply the new value only to the set with the matching index
                newAdditionalSets.push({...additionalSets[index], weight: value})
            }
        }
        setAdditionalSets(newAdditionalSets)
    }

    const onAdditionalSetRepsChange = (value, setIndex) => {
        if(!value)
            return

        if(!changesMadeToExercise)
            setChanesMadeToExercise(true)

        let newAdditionalSets = [];
        for(let [index, set] of additionalSets.entries()){
            if(index !== setIndex){
                newAdditionalSets.push(set);
            }
            else {
                // apply the new value only to the set with the matching index
                newAdditionalSets.push({...additionalSets[index], reps: value})
            }
        }
        setAdditionalSets(newAdditionalSets);

        // start the timer only if we haven't started it yet (if first time adjusting reps for this set)
        if(!hasTimerStartedForSets[exercise?.sets?.length + setIndex]){
            setHasTimerStartedForSets(prev => prev?.map((value, index) => index === (exercise?.sets?.length + setIndex) ? true : value))
            startRestTimer();
        }
    }

    const renderExerciseSets = (
        <>
            { isExerciseInProgress ? exercise?.sets?.length ? exercise?.sets?.map((exerciseSet, index) => {
                let previousWeight = "ex. 65";
                let previousReps = "ex. 8";
                
                // get weight of this set (assumed to be same order) to show as placeholder
                if(setLogsFromPreviousWorkout){
                    previousReps = setLogsFromPreviousWorkout[index]?.reps
                    previousWeight = setLogsFromPreviousWorkout[index]?.weight
                }

                return (
                    <View style={{display: 'flex', flexDirection: 'row', width: '75%'}} key={"exercise-set-" + index}>
                        <View style={{margin: 0, marginTop: "8%", maxWidth: "35%", minWidth: "35%"}}>
                            <Text>{exerciseSet.type} set</Text>
                        </View>
                        <View style={{display: 'flex', flexDirection: 'row', marginLeft: "10%", alignItems: "flex-end", maxWidth: "65%", paddingBottom: 3}}>
                            <Input onChangeText={(value) => onSetWeightChange(value, exerciseSet, index)} w="45%" h="75%" marginRight="1" variant="outline" placeholder={previousWeight?.toString()} minWidth={"25%"} keyboardType="numeric" bg="#EEEEEE" borderRadius={8}/>
                            <Text>lbs</Text>
                        </View>
                        <View style={{display: 'flex', flexDirection: 'row', marginLeft: 0, alignItems: "flex-end", paddingBottom: 3, paddingLeft: 10}}>
                            <Input onChangeText={(value) => onSetRepsChange(value, exerciseSet, index)} w="45%" h="75%" marginRight="1" variant="outline" placeholder={previousReps?.toString()} minWidth={"25%"} keyboardType="numeric" bg="#EEEEEE" borderRadius={8}/>
                            <Text>reps</Text>
                        </View>
                    </View>
            )})
            :
            // if the exercise has no sets
            <View>
                <Text>This exercise has no sets. Edit the exercise to add sets or you can add them here.</Text>
            </View>
            :
            <></>
            }
            {/* ui for additional sets */}
            { additionalSets?.map((set, index) => (
                <View style={{display: 'flex', flexDirection: 'row', width: '75%'}} key={"exercise-set-" + index}>
                    <View style={{margin: 0, marginTop: "8%", maxWidth: "35%", minWidth: "35%"}}>
                        <Text>{set.type} set</Text>
                    </View>
                    <View style={{display: 'flex', flexDirection: 'row', marginLeft: "10%", alignItems: "flex-end", maxWidth: "65%", paddingBottom: 3}}>
                        <Input onChangeText={(value) => onAdditionalSetWeightChange(value, index)} w="45%" h="75%" marginRight="1" variant="outline" placeholder="125" minWidth={"25%"} keyboardType="numeric" bg="#EEEEEE" borderRadius={8}/>
                        <Text>lbs</Text>
                    </View>
                    <View style={{display: 'flex', flexDirection: 'row', marginLeft: 0, alignItems: "flex-end", paddingBottom: 3, paddingLeft: 10}}>
                        <Input onChangeText={(value) => onAdditionalSetRepsChange(value, index)} w="45%" h="75%" marginRight="1" variant="outline" placeholder="6-12" minWidth={"25%"} keyboardType="numeric" bg="#EEEEEE" borderRadius={8}/>
                        <Text>reps</Text>
                    </View>
                </View>
            ))

            }
        </>
    )

    return (
        <View style={isEditMode ? { flexDirection: 'row', justifyContent: 'space-between', marginLeft: 10} : {}}>
            <Box alignItems="center">
                <Pressable onPress={onCardPress} style={{overflow: 'hidden', borderRadius: 25, borderWidth: 1, borderColor: 'lightgrey', shadow: 3}}>
                    <Box w="80" rounded="lg" overflow="hidden" borderRadius="25" borderColor="coolGray.200" borderWidth="0" _dark={{
                    borderColor: "coolGray.600",
                    backgroundColor: "gray.700"
                    }} _light={{
                    backgroundColor: "gray.50"
                }}>
                    <Stack p="4" space={3}>
                        <Stack space={2}>
                            <View style={{display: 'flex', flexDirection: "row", alignItems: "center", justifyContent: 'space-between'}}>
                                <Heading size="md" ml="-1" display="flex" flexWrap="wrap" marginLeft={1} flexDirection="row" width="75%">
                                {exercise?.name}
                                </Heading>
                                { (isWorkoutInProgress && !isExerciseInProgress) ?
                                    <Button borderRadius={18} marginRight="20" onPress={onExecute} size={12} style={{width: 70, height: 35}}>Start</Button>
                                    :
                                    <Pressable onPress={() => openExerciseHistory(exercise)} hitSlop={5} style={({pressed}) => [{}]}>
                                        {({pressed}) => (
                                            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', height: 25, width: 25}}>
                                                <Icon name="information" size={pressed ? 18 : 22} color={pressed ? "black" : "#707070"}/>
                                            </View>  
                                        )}
                                    </Pressable>
                                }
                            </View>
                            { !isExerciseInProgress && 
                                <Text fontSize="xs" _light={{
                                color: "violet.500"
                            }} _dark={{
                                color: "violet.400"
                            }} fontWeight="500" ml="-0.5" mt="-1">
                                {exercise.muscleGroup}
                                </Text>
                            }
                        </Stack>
                    { (!isWorkoutInProgress && !isExerciseInProgress) &&
                        <Text fontWeight="400">
                            {exercise?.description}
                        </Text>
                    }
                    { !isExerciseInProgress && 
                        <HStack alignItems="center" space={4} justifyContent="space-between">
                            <HStack alignItems="center">
                                <Text color="coolGray.600" _dark={{
                                color: "warmGray.200"
                            }} fontWeight="400">
                                {exercise?.sets?.length ? exercise?.sets?.length : "0"} sets
                                </Text>
                            </HStack>
                        </HStack>
                    } 
                    {renderExerciseSets}
                    { isExerciseInProgress && 
                        <View style={{display: 'flex', flexDirection: 'row', marginTop: 5}}>
                            <Button onPress={() => isSetTypeInputPending ? setIsSetTypeInputPending(false) : onAddSet()} size={12} style={{width: 80, height: 35, marginRight: 5}} borderRadius={18} paddingRight={2} paddingLeft={2}>{isSetTypeInputPending ? "Cancel" : "Add Set"}</Button>
                            <Button onPress={() => onToggleComments(exercise?._id)} size={12} width={15} style={{width: 95, height: 35, marginRight: 5}} borderRadius={18} paddingRight={2} paddingLeft={2}>{"Comments"}</Button>
                            {/* <Button onPress={() => onToggleComments(exercise?._id)} size={12} width={15} style={{width: 95, height: 35, marginRight: 5}} borderRadius={18} paddingRight={2} paddingLeft={2}>{"Edit Sets"}</Button> */}
                        </View>
                    }
                    { isSetTypeInputPending && 
                        <View>
                            <Text>Select Type:</Text>
                            <Select selectedValue={""} minWidth="200" accessibilityLabel="Choose set type" placeholder="Choose Service" _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="5" />
                            }} mt={1} onValueChange={itemValue => onAddSetConfirmed(itemValue)}>
                                <Select.Item label="Warmup" value="warmup" />
                                <Select.Item label="Working" value="working" />
                            </Select>
                        </View>
                    }
                    </Stack>
                </Box>
            </Pressable>
        </Box>
        { isEditMode && 
            <View style={{margin: 10, flexDirection: "column", justifyContent: 'space-between'}}>
                <Pressable onPress={onDelete}>
                <DeleteIcon/>
                </Pressable>
                <View>
                    <Pressable onPress={onMoveUp} style={{paddingBottom: 7}}>
                        <ChevronUpIcon/>
                    </Pressable>
                    <Pressable onPress={onMoveDown}>
                        <ChevronDownIcon/>
                    </Pressable>
                </View>
            </View>
        }
        </View>
    );
}

export { ExerciseCard };