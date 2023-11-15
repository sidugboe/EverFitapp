import React, { useState, useEffect } from "react";
import { Center, Button, View, ScrollView, Text, Pressable} from 'react-native';
import { Button as NativeButton } from "native-base";
import AppBarHeader from "../../components/appbars/AppbarHeader";
import { PreviousWorkoutTable } from "../../components/previousWorkouts/PreviousWorkoutList";
import { useWorkoutLogs } from "../../services/workoutLogService";
import { useWorkouts } from "../../services/workoutService";
import { TrainingLibraryOverlay } from "../../components/trainingLibrary/TrainingLibraryOverlay";
import { HomeScreenItem } from "./HomeScreenItem";
import { CheckInOverlay } from "../../components/check-in/CheckInOverlay";
import { CreateBar, LibraryPressable } from './TrainingHomeComponents'
import { useAuth } from "../../services/authService";
import { isDateFromToday } from "../../utils/helpers/dateHelper";
import { useProfile } from "../../services/profileService";
import { default as CommunityIcon } from 'react-native-vector-icons/MaterialCommunityIcons';
import { opacityOnPressed } from "../../utils/helpers/colorHelper";
import { returnNewerDate } from "../../utils/helpers/dateHelper";

const TrainingHomePage = (props) => {
    const { navigation, route} = props
    const [userCurrentSplitDay, setUserCurrentSplitDay] = useState(0);
    const [nextWorkoutInSplit, setNextWorkoutInSplit] = useState({})
    const [hasUserCompleteTodaysWorkout, setHasUserCompleteTodaysWorkout] = useState(false);
    const [showRecentWorkoutTable, setShowRecentWorkoutTable] = useState(true);
    const [trainingLibrarySettings, setTrainingLibrarySettings] = useState({isVisible: false, mode: "view", itemType: "", onConfirmItems: undefined, confirmationModalTitle: "", confirmationModalBody: ""});  // object for training library settings { isVisible: true | false, mode: "some mode", itemType: "exercises", onConfirmItems: function, confirmationModalTitle: "some string", confirmationModalBody: "some body"}
    const [isCheckInFormOpen,setIsCheckInFormOpen] = useState(false)

    // todo show this button if the user doesn't have a routine selcted
    const [showSelectRoutineButton, setShowSelectRoutineButton] = useState(true)

    // hook calls
    const { user, isLoading: isLoadingUser, refetchUser } = useAuth();
    const { workoutLogs, isLoading: isLoadingWorkoutLogs } = useWorkoutLogs(user?._id);
    const { workouts, isLoading: isLoadingWorkouts } = useWorkouts(user?._id);
    const { changeUserRoutine } = useProfile();

    useEffect(() => {
        if(!isLoadingWorkoutLogs && !isLoadingUser && !isLoadingWorkouts){
            // check if user does not have active routine if so apply state
                // todo waiting for user active routine
            
            // update ui now that routine/workout info is available
            applyRoutineInfo()
        }
    }, [isLoadingWorkoutLogs, isLoadingUser, isLoadingWorkouts])

    const applyRoutineInfo = () => {
        let recentWorkoutLog = workoutLogs?.sort((item1, item2) => returnNewerDate(item1.date, item2.date))[0];  // assumes certain order of records
        
        if(!user.activeRoutine){
            setShowSelectRoutineButton(true)
            return;
        }
        setShowSelectRoutineButton(false)

        if(!user.activeRoutine.workoutTemplates){
            return;
        }

        if(!recentWorkoutLog){
            return;
        }

        // find what day in the routine said workout is
        let workoutNo = 1;
        for(let workout of user?.activeRoutine?.workoutTemplates){
            if(workout?.toString() === recentWorkoutLog?.workoutTemplate?.toString()){

                let splitDay;   // what day in the split the user is at
                let nextWorkoutId;  // id for tomorrows workout
                let isRecentWorkoutLogFromToday = isDateFromToday(recentWorkoutLog?.date)
                
                if(isRecentWorkoutLogFromToday)    // if the workout log is today then don't add 1 to the split day
                    splitDay = workoutNo;
                else
                    splitDay = workoutNo + 1;   // else the split day is next workout number

                // update split day state
                setUserCurrentSplitDay(splitDay);
                setHasUserCompleteTodaysWorkout(isRecentWorkoutLogFromToday);
                nextWorkoutId = splitDay > user?.activeRoutine?.workoutTemplates.length ? user?.activeRoutine?.workoutTemplates[0] : user?.activeRoutine?.workoutTemplates[splitDay - 1];

                // get the next workout name as well
                for(let workout of user?.activeRoutine?.workoutTemplates){
                    if(workout === nextWorkoutId)
                        setNextWorkoutInSplit(workouts.find(workout => workout?._id === nextWorkoutId));
                }
            }
            else
                workoutNo++;
        }
    }

    const onStartWorkoutPress = () => {
        if(hasUserCompleteTodaysWorkout)
            return
        // todo fetch routine workouts in backgroun here and pass them to workoutScreen so there isn't a second before they load
        navigation.navigate("Workouts", { routineData: user?.activeRoutine});
    }

    const onTrainingLibraryPress = () => {
        setTrainingLibrarySettings({isVisible: true, mode: "view", itemType: ""})
    }

    const onLogsPress = () => {
        navigation.navigate("WorkoutLogs", {workoutLogs: workoutLogs})
    }

    const onAnalysticsPress = () => {
        navigation.navigate("Analytics")
    }

    const onRoutineInfoPress = () => {
        alert("not implemented")
    }

    const onChangeRoutinePress = () => {
        setTrainingLibrarySettings({isVisible: true, mode: "select", itemType: "routine", onConfirmItems: onRoutineChange, confirmationModalTitle: "Change Routine", confirmationModalBody: "Are you sure you want to change your active routine?"})
    }

    const onBrowseRoutinesPress = () => {
        navigation.navigate("Routines"/*, { routineData: userActiveRoutine }*/);
    }

    const renderCurrentSplitInformation = (
        <View style={{ display: 'flex', flexDirection: 'column', alignItems: "flex-start", marginTop: 10}}>
            { showSelectRoutineButton ? 
                <>
                    {/* todo replace these buttons */}
                    <Text style={{fontWeight: "bold", fontSize: 20}}>No routine currently active.</Text>
                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: "space-around", marginLeft: 20, marginTop: 7}}>
                        <NativeButton borderRadius={18} marginLeft="0" onPress={onChangeRoutinePress} size={12} style={{width: 110, height: 35}}>Select Routine</NativeButton>
                        <NativeButton borderRadius={18} marginLeft="10" marginRight="20" onPress={onRoutineInfoPress} size={12} style={{width: 135, height: 35}}>What is a routine?</NativeButton>
                    </View>
                </>
                :
                <>
                    <Text style={{fontWeight: "bold", fontSize: 20}}>Todays Workout</Text>
                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: "space-around", marginTop: 2}}>
                        <Pressable onPress={onStartWorkoutPress} style={({pressed}) => [{ borderRadius: 8, display: 'flex', flexDirection: 'column', width: "100%", paddingHorizontal: "2.5%", backgroundColor: opacityOnPressed(pressed, "#e6e6e6", hasUserCompleteTodaysWorkout ? 0 : 0.4)}]}>
                            { ({pressed}) => (
                                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <Text style={{fontSize: 20}}>{user?.activeRoutine?.name} Day {userCurrentSplitDay} - {nextWorkoutInSplit?.name}</Text>
                                    <CommunityIcon name={hasUserCompleteTodaysWorkout ? "check" : "chevron-right"} size={35} style={{marginRight: 10}}/>
                                </View>
                            )} 
                        </Pressable>
                    </View>
                </>
            }

        </View>
    )

    const onRoutineChange = async (items) => {
        if(items[0]?._id === user.activeRoutine?._id)
            alert("Please select a different routine to change it.")
        else {
            await changeUserRoutine(items[0]?._id)
            refetchUser()
        }
    }

    // todo rename this section
    const renderToolsSection = (
        <View>
            <View style={{ marginTop: 15, margin: 5, display: 'flex', flexDirection: 'column', backgroundColor: 'lightgreen', marginBottom: 0}}>
                <Button title={"View All Workout Logs"} onPress={onLogsPress}></Button>
            </View>
            <View style={{ margin: 5, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <Button title={"Change Routine"} onPress={onChangeRoutinePress} ></Button>
                <Button style={{marginLeft:3}} title={"Browse Routines"} onPress={onBrowseRoutinesPress} color ='#c239c4' ></Button>
            </View>
            <CreateBar nav={navigation}/>         
            <LibraryPressable inputFunction={onTrainingLibraryPress}/>
        </View>
    )

    const onBrowseWorkoutsPress = () => {
        navigation.navigate("Workouts")
    }

    return (
        <>
            <View style={{flex: 1, display: 'flex', flexGrow: 1 }}>
                <AppBarHeader/>
                    <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '75%'}}>
                        <View style={{display: 'flex', flexDirection: 'column', alignItems: 'baseline', marginHorizontal: '2%'}}>
                            <View style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                                <Text style={{fontSize: 27}}>Welcome Back, {user?.name}</Text>
                                {/* <Text style={{fontSize: 22}}></Text> */}
                                <View style={{display: 'flex', flexDirection: 'column', width: '100%', backgroundColor: "#e6e6e6", borderRadius: 6, padding: 5, marginTop: 10}}>
                                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                                            <Text style={{fontSize: 20, marginRight: 5}}>{workoutLogs.length}</Text>
                                        </View>
                                        <Text style={{fontSize: 15, paddingTop: 1}}>workouts tracked</Text>
                                    </View>
                                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                                            <Text style={{fontSize: 20, marginRight: 5}}>{"572"}</Text>
                                        </View>
                                        <Text style={{fontSize: 15, paddingTop: 1}}>reps performed</Text>
                                    </View>
                                </View>
                            </View>
                            {renderCurrentSplitInformation}
                        </View>
                        <View style={{}}>
                            {/* <PreviousWorkoutTable workoutsShown={3} isVisible={showRecentWorkoutTable} workoutLogs={workoutLogs}/> */}
                        </View>
                        <View>
                        <View style={{display: 'flex', flexDirection: 'column', alignItems: "center"}}>
                            <View style={{display: 'flex', flexDirection: 'row', marginBottom: 8}}>
                                <HomeScreenItem onPress={onLogsPress} itemTitle={"View Logs"} iconName="archive"/>
                                <HomeScreenItem onPress={onAnalysticsPress}itemTitle={"Analytics"} iconName="chart-line"/>
                                <HomeScreenItem onPress={() => setIsCheckInFormOpen(true)} itemTitle={"Check-ins"} iconName="clipboard-outline"/>
                                <HomeScreenItem onPress={onTrainingLibraryPress} itemTitle={"Training\n Library"} iconName="view-list"/>
                            </View>
                            <View style={{display: 'flex', flexDirection: 'row'}}>
                                <HomeScreenItem onPress={onChangeRoutinePress} itemTitle={" Change Routines"} iconName={"calendar-month-outline"}/>
                                {/* <HomeScreenItem itemTitle={"Settings"} iconName={"cog-outline"}/> */}
                                <HomeScreenItem onPress={onBrowseRoutinesPress} itemTitle={"   View Routines"} iconName={"cog-outline"}/>
                                <HomeScreenItem onPress={onBrowseWorkoutsPress} itemTitle={"    View\nWorkouts"} iconName={"cube-outline"}/>
                                <HomeScreenItem itemTitle={"  About\n EverFit"} iconName={"information-outline"}/>
                            </View>
                        </View>
                        </View>
                    </View>
            </View>
            <CheckInOverlay isVisible={isCheckInFormOpen} onClose={() => setIsCheckInFormOpen(false)}/>
            <TrainingLibraryOverlay navigation={navigation} onClose={() => setTrainingLibrarySettings(prev => ({...prev, isVisible: false}))} {...trainingLibrarySettings}/>
        </>
    )
};

export { TrainingHomePage };