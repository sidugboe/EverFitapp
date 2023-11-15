
import React, { useState, useEffect } from "react";
import { Text, Button, View, ScrollView } from 'react-native';
import { ExerciseCard } from "../exerciseList/ExerciseCard";
import ExeriseListAppBar from "./ExerciseListAppBar";
import { ConfirmationModal  } from "../../components/modal/ConfirmationModal";
import { TrainingLibraryOverlay } from "../../components/trainingLibrary/TrainingLibraryOverlay";
import { ExerciseCommentsOverlay } from "./ExerciseCommentsOverlay";
import { useExerciseLogs } from "../../services/exerciseLogService";
import { useWorkoutLogs } from "../../services/workoutLogService";
import { ExerciseHistoryOverlay } from "../../components/exerciseHistory/ExerciseHistoryOverlay";
import { AutoTrackModal } from "../../components/autoTrack/AutoTrackModal";

const WEIGHT_UNITS = "lbs"
/**
 * ExerciseScreen component is the screen displayed when a user selects a workout within a Routine (in the RoutineScreen component)
 * This component renders the list of exercises within a Workout
 * @param {*} props 
 * @returns 
 */
const ExerciseScreen = (props) => {
    const { navigation, route} = props
    const selectedWorkout = route?.params?.workoutData;

    // component state
    const [exercises, setExercises] = useState([]);
    const [exerciseInProgress, setExerciseInProgress] = useState("");   // the name of the current exercise being executed OR "finish". All chidren cards are listening for finish state so they can update the parent with their values
    const [exerciseLogs, setExerciseLogs] = useState([]); // collection containing all logs and set logs for each exercise to be split up and formatted on save 
    const [timerValue, setTimerValue] = useState(0)
    const [timerInstance, setTimerInstance] = useState(0)
    const [exerciseComments, setExerciseComments] = useState({});
    const [commentsOpenExercise, setCommentsOpenExercise] = useState("")    // id of exercise that has comments open
    const [changesMadeToWorkout, setChangesMadeToWorkout] = useState(false) // whether ANYTHing has been changed so prompt modal before exiting

    // component boolean state
    const [exerciseHistoryOverlayExercise, setExerciseHistoryOverlayExercise] = useState(""); // string value for whatever exercise the modal has been opened for
    const [isEditMode, setIsEditMode] = useState(false);
    const [isWorkoutInProgress, setIsWorkoutInProgress] = useState(false);
    const [isFinishConfirmationModalOpen, setIsFinishConfirmationModalOpen] = useState(false);
    const [isExitConfirmationModalOpen, setIsExitConfirmationModalOpen] = useState(false);
    const [isTrainingLibraryOpen, setIsTrainingLibraryOpen] = useState(false);
    const [isExerciseCommentsModalOpen, setIsExerciseCommentsModalOpen] = useState({open: false, exercise: undefined});
    const [canSave, setCanSave] = useState(false);
    const [isAutoTrackModalOpen, setIsAutoTrackModalOpen] = useState(false)

    // hook calls
    const { createExerciseLog, exerciseLogs: exerciseLogRecords } = useExerciseLogs();
    const { createWorkoutLog } = useWorkoutLogs();

    useEffect(() => {
        // if we have exercises for the selected workout get them from list of all exercises
        if(selectedWorkout?.exerciseTemplates?.length){
            // set the exercises
            setExercises(selectedWorkout?.exerciseTemplates)
        }
    })

    useEffect(() => {

        const saveAndReturnToWorkoutScreen = async () => {
            // save all exercise logs
            // note state here should be updated with open exercises if not use a isSaving state and useEffect
            let promises = []
            for(let [index, exerciseLog] of exerciseLogs.entries()){

                promises[index] = createExerciseLog(exerciseLog)
            }

            // wait for all promises to be complete before returning to previous screen
            let results = await Promise.allSettled(promises)
            
            // check if any promise were rejected)
            let success = true;
            for(let result of results){
                if(result.status == "rejected")
                    success = false;
            }

            if(!success){
                // do something
            }

            // should have put this save login inside the exercise cards themselves onChange

            let createdExerciseLogIds = results.map(result => result?.value?.data?._id)

            // save the workout log
                let newWorkoutLog = {
                    workoutTemplate: selectedWorkout._id,
                    exerciseLogs: createdExerciseLogIds,
                    ...selectedWorkout
                }

            // remove exerciseTemplates from workoutLog since is was added from WorkoutTemplate
            delete newWorkoutLog.exerciseTemplates
            delete newWorkoutLog._id

            // create workout log -  not awaiting this but maybe should
            let res = await createWorkoutLog(newWorkoutLog)

            if(props?.route?.params?.routineData)
                navigation.navigate("Workouts", { routineData: props.route.params.routineData, mode: "workoutSummary" })
            else
                navigation.goBack();
        }
        // if canSave, most recent open child has updated exerciseLog state so we can save it now
        if(canSave){
            saveAndReturnToWorkoutScreen();
        }
    }, [canSave])

    const onEditButtonPress = () => {
        setIsEditMode((previousMode) => !previousMode); // same as setIsEditMode(!isEditMode)
    }

    const onExerciseMoveDown = (selectedExercise) => {
        let exerciseid = selectedExercise?._id?.toString();
        let newExerciseArray = [];
        let index = 0;

        for(let exercise of exercises){
            if(exercise?._id?.toString() === exerciseid){
                // check that it's not the last item
                if(index !== exercises.length - 1)
                    newIndex = index + 1;
                else {
                    return; // throw error toast
                }
            }

            index++;
        }

        for(let i = 0; i < exercises.length; i++){
            if(i !== newIndex - 1)
                newExerciseArray.push(exercises[i]);
            if(i === newIndex){
                newExerciseArray.push(selectedExercise);
            }
        }

        setExercises(newExerciseArray);
    }

    const onExerciseMoveUp = (selectedExercise) => {
        let exerciseid = selectedExercise?._id?.toString();
        let newExerciseArray = [];
        let index = 0;
        let newIndex;

        for(let exercise of exercises){
            if(exercise?._id?.toString() === exerciseid){
                // check that it's not the first item
                if(index !== 0)
                    newIndex = index - 1;
                else
                    return; // throw error toast
            }

            index++;
        }

        for(let i = 0; i < exercises.length; i++){
            if(i === newIndex)
                newExerciseArray.push(selectedExercise);
            
            if(i !== newIndex + 1)
                newExerciseArray.push(exercises[i]);
        }
        
        setExercises(newExerciseArray);
    }

    const onExerciseDelete = (exercise) => {
        // todo add confirmation modal

        let exerciseid = exercise?._id?.toString();
        deleteExercise(exerciseid);

        // clone exercsies and remove deleted one
        let newExerciseArray = [];

        for(let exercise of exercises){
            if(exercise?._id?.toString() !== exerciseid)
                newExerciseArray.push(exercise);
        }
        setExercises(newExerciseArray);
    }

    const onExecutePress = () => {
        // todo open modal and confirm user wants to start / end exercise
        setIsWorkoutInProgress(true);

        if(!isWorkoutInProgress){
            // save the workout data and exercise logs
        }
        else {
            // logic we may need when starting workout
        }
    }

    const returnToWorkoutScreen = () => {
        // todo note I think that we can just call goBack regardless here but leaving cuz demo today
        if(props?.route?.params?.routineData)
            navigation.navigate("Workouts", { routineData: props.route.params.routineData })
        else
            navigation.goBack()
    }

    const onWorkoutFinish = () => {
        // prompt confirmation
        setIsFinishConfirmationModalOpen(true);     
    }

    const finishWorkout = () => {
        // set state to finish so children know to save
        setExerciseInProgress("finish")

        // todo check here if we have the data in exerciseLogs for exercsie that was OPEN when we clicked save
    }

    const exitWorkout = () => {
        // save workout data
        finishWorkout();    // todo create seperate function for exiting and finishing?
        // todo add logic for continuing an exited workout anyways

        // return to workout screen
        returnToWorkoutScreen();
    }

    const onAddExercisePress = () => {
        ///navigation.navigate("TrainingLibrary", {mode: "selectMultiple", itemType: "exercise", returnTo: "Exercises"});
        //setIsAwaitingReturn(true);
        setIsTrainingLibraryOpen(true)
    }

    const addExercisesToWorkout = (exercises) => {
        // send request to update exercise workoutId and update workout exeerciseTemplates
        alert("Exercise successfully added (joking but soon)")
    }

    const startRestTimer = () => {
        setTimerValue(120)
        setTimerInstance(prev => prev + 1)
    }

    const onToggleComments = (exerciseId) => {
        setCommentsOpenExercise(exerciseId)
        setIsExerciseCommentsModalOpen(true)
    }

    const onCommentsChange = (text) => {
        setExerciseComments(prev => ({...prev, [commentsOpenExercise]: text}))
    }

    const onAutoTrackOpen = () => {
        setIsAutoTrackModalOpen(true)
    }

    const onAutoTrackClose = (data) => {
        // do something with the data
        
        // close the modal
        setIsAutoTrackModalOpen(false)
    }

    return (
        <>
            <ExeriseListAppBar isWorkoutInProgress={isWorkoutInProgress} onEditPress={onEditButtonPress} isEditMode={isEditMode} returnToWorkoutScreen={returnToWorkoutScreen} onBackPress={() => isWorkoutInProgress ? changesMadeToWorkout ? setIsExitConfirmationModalOpen(true) : returnToWorkoutScreen() : returnToWorkoutScreen()} timerValue={timerValue} timerInstance={timerInstance} heading={selectedWorkout?.name} onAutoTrackOpen={onAutoTrackOpen}/>
            <ScrollView style={{padding: 5}}>
                { exercises?.map((exercise, index) => {
                        return (
                            <View style={{paddingVertical: 10}} key={"exercise-" + index}>
                                <ExerciseCard exercise={exercise} isWorkoutInProgress={isWorkoutInProgress} navigation={navigation} isEditMode={isEditMode} onDelete={() => onExerciseDelete(exercise)} onMoveDown={() => onExerciseMoveDown(exercise)} onMoveUp={() => onExerciseMoveUp(exercise)} exerciseInProgress={exerciseInProgress} exerciseLogs={exerciseLogs} setExerciseInProgress={setExerciseInProgress} setExerciseLogs={setExerciseLogs} startRestTimer={startRestTimer} onToggleComments={onToggleComments} setChangesMadeToWorkout={setChangesMadeToWorkout} setCanSave={setCanSave} openExerciseHistory={(exercise) => setExerciseHistoryOverlayExercise(exercise)}/>
                            </View>
                        )
                    })
                }
            </ScrollView>
            { isEditMode ?
                <Button title={"Add Exercises"} onPress={onAddExercisePress}></Button>
                :
                <Button title={isWorkoutInProgress ? 'Finish Workout' : 'Execute Workout'} onPress={() => isWorkoutInProgress ? onWorkoutFinish() : onExecutePress()}></Button>
            }

            {/* Confirmation modal for finishing workout */}
            <ConfirmationModal isVisible={isFinishConfirmationModalOpen} onClose={() => setIsFinishConfirmationModalOpen(false)} onConfirm={finishWorkout} titleText={"Finish Workout?"} bodyText={"Are you sure you want to submit this workout?"} showCancelButton={true}/>

            {/* Overlays */}
            <ConfirmationModal isVisible={isExitConfirmationModalOpen} onClose={() => setIsExitConfirmationModalOpen(false)} onConfirm={exitWorkout} titleText={"Exit Workout?"} bodyText={"Are you sure you want to exit the workout?"} showCancelButton={true}/>
            <TrainingLibraryOverlay isVisible={isTrainingLibraryOpen} onClose={() => setIsTrainingLibraryOpen(false)} mode={"selectMultiple"} itemType={"exercise"} onConfirmItems={(item) => addExercisesToWorkout(item)} confirmationModalTitle={"Add Exercises To Workout?"} confirmationModalBody={"Press continue to apply these changes"}/>
            <ExerciseCommentsOverlay isVisible={isExerciseCommentsModalOpen} onClose={() => setIsExerciseCommentsModalOpen(false)} onCommentsChange={onCommentsChange} exerciseComments={exerciseComments[commentsOpenExercise]}/>
            <ExerciseHistoryOverlay exerciseLogs={exerciseLogRecords.filter(log => log.exerciseTemplate === exerciseHistoryOverlayExercise?._id)} selectedExercise={exerciseHistoryOverlayExercise} onClose={() => setExerciseHistoryOverlayExercise("")}/>
            <AutoTrackModal isVisible={isAutoTrackModalOpen} onClose={onAutoTrackClose}/>
        </>
    )
}


// polyfill issues with promise.allSettles becuase verioning
Promise.allSettled = Promise.allSettled || ((promises) => Promise.all(
    promises.map(p => p
        .then(value => ({
            status: "fulfilled",
            value
        }))
        .catch(reason => ({
            status: "rejected",
            reason
        }))
    )
));

export { ExerciseScreen };