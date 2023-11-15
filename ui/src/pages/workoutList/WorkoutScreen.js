import React, { useState, useEffect } from "react";
import { Text, Button, View, ScrollView, TouchableOpacity } from 'react-native';
import { WorkoutCard } from "./WorkoutCard";
import { useWorkouts } from "../../services/workoutService";
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from "../../stylesheet";
import { TrainingLibraryOverlay } from "../../components/trainingLibrary/TrainingLibraryOverlay";
import { useRoutines } from "../../services/routineService";
import { WorkoutListAppBar } from "./WorkoutListAppBar";
import { WorkoutList } from "./WorkoutList";

/**
 * WorkoutScreen component is the screen displayed when a user selects a Routine from the RoutineScreen
 * After doing so the user is navigated to this screen that shows the workouts within said routine
 * @param {*} props 
 * @returns 
 */
const WorkoutScreen = (props) => {
    const { navigation, route} = props
    const currentRoutine = route?.params?.routineData

    const [trainingLibrarySettings, setTrainingLibrarySettings] = useState({isVisible: false, mode: "view", itemType: "", onConfirmItems: undefined, confirmationModalTitle: "", confirmationModalBody: ""});  // object for training library settings { isVisible: true | false, mode: "some mode", itemType: "exercises", onConfirmItems: function, confirmationModalTitle: "some string", confirmationModalBody: "some body"}
    const [isEditMode, setIsEditMode] = useState(false)
    const [workoutsInRoutine, setWorkoutsInRoutine] = useState([])

    // hook calls
    const { workouts, createWorkouts, refetchWorkouts, getPublicWorkoutsById, isLoading: isLoadingWorkouts } = useWorkouts();
    const { editRoutine } = useRoutines()

    // currentRoutine.workoutTemplates can either be array of ids or an array of (already populated) workout objects
    useEffect(() => {
        const fetchData = async () => {
             // fetch the current routine has already autopopulated workoutTemplates ftech using those objects ids
             if(currentRoutine?.workoutTemplates[0]._id){
                setWorkoutsInRoutine(currentRoutine?.workoutTemplates)
            }
            // else fetch by the ids in the array
            else {
                let workoutPromises =  getPublicWorkoutsById(currentRoutine?.workoutTemplates);

                // wait for all promises to be complete before returning to previous screen
                let results = await Promise.allSettled(workoutPromises)

                // check if any promise were rejected)
                let success = true;
                for(let result of results){
                    if(result.status == "rejected")
                        success = false;
                }

                if(!success){
                    // do something
                }

                let workoutTemplates = results.map(result => result?.value)
                setWorkoutsInRoutine(workoutTemplates)
            }
        }

        if(currentRoutine && currentRoutine?.workoutTemplates?.length){
            fetchData();
        }
        // otherwise simply show all of the user's workouts (for when they come here form browse workouts in homescreen)
        else if(!currentRoutine && !isLoadingWorkouts){
            setWorkoutsInRoutine(workouts)
        }
    }, [currentRoutine, isLoadingWorkouts])

    const onEditPress = () => {
        navigation.navigate("EditRoutine", {});
    }

    const onAddWorkoutsToRoutine = (workouts) => {
        // add workouts to routine
        let updatedRoutine = {

        }
        //editRoutine()
    }

    const onAddWorkoutPress = () => {
        setTrainingLibrarySettings({isVisible: true, mode: "selectMultiple", itemType: "workout", onConfirmItems: onAddWorkoutsToRoutine, confirmationModalTitle: "Add workouts to routine?", confirmationModalBody: "Are you sure you want to add the selected item(s) to this routine?"})
    }
    
    const onAppbarEditPress = () => {
        setIsEditMode(prev => !prev)
    }

    const onAppbarBackPress = () => {
        navigation.goBack()
    }

    const onCreateWorkoutPress = () => {
        navigation.navigate("AddWorkout")
    }
    
    return (
        <>
            <WorkoutListAppBar navigation={navigation} heading={currentRoutine?.name} onEditPress={onAppbarEditPress} isEditMode={isEditMode} onBackPress={onAppbarBackPress}/>
            <WorkoutList workouts={workoutsInRoutine} navigation={navigation} setTrainingLibrarySettings={setTrainingLibrarySettings}/>
            <TrainingLibraryOverlay navigation={navigation} onClose={() => setTrainingLibrarySettings(prev => ({...prev, isVisible: false}))} {...trainingLibrarySettings} />
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

export { WorkoutScreen };