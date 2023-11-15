import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, Pressable } from 'react-native';
import * as RootNavigation from '../../components/navigation/RootNavigationRef';
import styles from "../../stylesheet";
import { ThreeDotsIcon, AddIcon, CheckIcon, Button, ArrowBackIcon } from 'native-base';
import { Timer } from '../../components/appbars/Timer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { opacityOnPressed } from '../../utils/helpers/colorHelper';

const ExeriseListAppBar = ({ navigation, onEditPress, isEditMode, workoutInProgress, onBackPress, isWorkoutInProgress, timerValue, timerInstance, heading, onAutoTrackOpen }) => {
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timerAdd30, setTimerAdd30] = useState(0);
    const [timerSubtract30, setTimerSubtract30] = useState(0);
    const [isTimerComplete, setIsTimerComplete] = useState(false);

    useEffect(() => {
        // if a workout is in progress
        if(workoutInProgress){
            setSetStartTime(new Date());
            setIsTimerComplete(false);
        }
    }, [workoutInProgress])

    useEffect(() => {
        if(timerInstance)
            setIsTimerRunning(true)
        setIsTimerComplete(false)
    }, [timerValue, timerInstance])

    const onToggleTimer = () => {
        setIsTimerRunning(prev => !prev)
    }

    const onTimerAdd30 = () => {
        setTimerAdd30(prev => prev + 1);
        setIsTimerComplete(false);
    }

    const onTimerSubtract30 = () => {
        setTimerSubtract30(prev => prev + 1)
    }

    const onTimerComplete = () => {
        setIsTimerComplete(true)
    }

    const onAutoTrackPress = () => {
        onAutoTrackOpen();
    }

    return (
        <View>
            <View style={[{...styles.AppBarContainer}, {backgroundColor: isTimerComplete ? '#7BEA7B' : 'white'}]}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Button variant="ghost" onPress={onBackPress} style={{borderRadius: 50}}>
                        <ArrowBackIcon></ArrowBackIcon>
                    </Button>
                    <Text style={{fontSize: 25, color: 'black', height: 35}}>{heading}</Text>
                </View>
                <View style={{marginRight: 10, display: 'flex', flexDirection: 'row'}}>
                    { isWorkoutInProgress ?
                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <Pressable onPress={onAutoTrackPress} style={({pressed}) => [{borderRadius: 12}]}>
                                { ({pressed}) => (
                                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                                        <Icon name="refresh-auto" style={{paddingLeft: 5, paddingRight: 5, color: opacityOnPressed(pressed, "#000000")}} size={22}/>
                                    </View>
                                )}                   
                            </Pressable>
                            { isTimerRunning ? 
                                <Pressable onPress={onToggleTimer} style={({pressed}) => [{borderRadius: 12}]}>
                                    { ({pressed}) => (
                                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                                            <Icon name="pause"style={{paddingRight: 5, color: opacityOnPressed(pressed, "#000000")}} size={22}/>
                                        </View>
                                    )}                   
                                </Pressable>
                                :
                                <Pressable onPress={onToggleTimer} style={({pressed}) => [{borderRadius: 12}]}>
                                    { ({pressed}) => (
                                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                                            <Icon name="play" style={{paddingRight: 5, color: opacityOnPressed(pressed, "#000000")}} size={22}/>
                                        </View>
                                    )}                   
                                </Pressable>
                            }
                            <Pressable onPress={onTimerSubtract30} style={({pressed}) => [{borderRadius: 12}]}>
                                { ({pressed}) => (
                                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                                        <Icon name="rewind-30" size={20} style={{color: opacityOnPressed(pressed, "#000000")}}/>
                                    </View>
                                )}                   
                            </Pressable>
                            <Timer seconds={timerValue} isTimerRunning={isTimerRunning} timerValue={timerValue} timerInstance={timerInstance} timerAdd30={timerAdd30} timerSubtract30={timerSubtract30} onTimerComplete={onTimerComplete}/>
                            <Pressable onPress={onTimerAdd30} style={({pressed}) => [{borderRadius: 12}]}>
                                { ({pressed}) => (
                                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                                        <Icon name="fast-forward-30" style={{color: opacityOnPressed(pressed, "#000000"), paddingRight: 10}} size={20}/>
                                    </View>
                                )}                   
                            </Pressable>
                        </View>
                        : 
                        <>
                            {/* <Button size="10" variant="outline" onPress={onEditPress} style={{marginLeft: 10}}>Back</Button> */}
                            { isEditMode ? 
                                <Button size="10" width="12" height="30" variant="outline" onPress={onEditPress} style={{marginLeft: 10}}>Done</Button>
                                :
                                <>
                                {/* <Button size="25" width="20" height="33" variant="outline" onPress={onEditPress} style={{marginLeft: 10}}>About</Button> */}
                                <Button size="25" width="20" height="33" variant="outline" onPress={onEditPress} style={{marginLeft: 10}}>Edit</Button>
                                {/* <Button size="10" variant="outline" onPress={onEditPress} style={{marginLeft: 10}}></Button> */}
                                </>
                            }
                        </>
                    }
                </View>
            </View>

            {/* todo add vector icons via https://github.com/oblador/react-native-vector-icons#bundled-icon-sets - NOT working */}
            {/* <Icon name="rocket" size={30} color="#900" /> */}


            {/* todo add profile popout */}

        </View>
    );
};

export default ExeriseListAppBar;