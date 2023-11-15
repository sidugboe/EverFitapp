import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, Pressable } from 'react-native';

const TIME_IN_MILISECONDS_TO_COUNTDOWN = 60*10*1000;
const INTERVAL_IN_MILISECONDS = 100;

export const Timer = ({seconds, isTimerRunning, timerValue, timerInstance, timerAdd30, timerSubtract30, onTimerComplete}) => {
    const [time, setTime] = useState(seconds*1000); // time in milliseconds
    const [referenceTime, setReferenceTime] = useState(Date.now());
    const [currentTimeout, setCurrentTimeout] = useState();
    const [wasTimerPaused, setWasTimerPaused] = useState(false);
    const [remainingTimeLow, setRemainingTimeLow] = useState(false);

    useEffect(() => {
        if(isTimerRunning){

            if(wasTimerPaused)
                setWasTimerPaused(false)

            if(time === 0){
                onTimerComplete();
            }

            const countDownUntilZero = () => {
                setTime(prevTime => {
                    if (prevTime <= 0) return 0;

                    if((time/1000) < 10)
                        setRemainingTimeLow(true)
                    
                    const now = Date.now();
                    let interval;

                    if(wasTimerPaused)
                        interval = 400;    // if timer was paused set interval to non-zero negligible value (if set to zero useEffect will not be called again because time will not change and trigger effect)
                    else
                        interval = now - referenceTime; // now is greater than reference time
                    setReferenceTime(now);

                    return prevTime - interval;
                });
            }

            let timeoutId = setTimeout(countDownUntilZero, INTERVAL_IN_MILISECONDS)
            setCurrentTimeout(timeoutId);

            // cleanup function or timer will speed up on reload
            return () => clearTimeout(timeoutId)
        }
        else {
            setWasTimerPaused(true)
        }
    }, [time, isTimerRunning]);

    // resets timer when timer value is reset
    useEffect(() => {
        if(timerValue){
            clearTimeout(currentTimeout)
            setReferenceTime(Date.now())
            setTime(timerValue*1000)
        }
    }, [timerValue, timerInstance])

    // runs as a side effect to add/subtract 30 button presses to adjust total remaining time
    useEffect(() => {
        if(timerAdd30)
        setTime(prev => prev + (30*1000))
        setReferenceTime(Date.now())    // or skipping 30 secs forward after timer finish will make it jump to ~25 instead of 30
    }, [timerAdd30])

    useEffect(() => {
        setTime(prev => prev - (30*1000))
    }, [timerSubtract30])

    const secondsValue = (((time/1000)%60).toFixed(0) < 10 ? "0" : "") + (((time/1000)%60).toFixed(0) > 0 ? ((time/1000)%60).toFixed(0) : "0");
    const minutesValue = Math.floor((time/60/1000)) > 0 ? Math.floor((time/60/1000)) : "0"

    return (
        <View style={{marginHorizontal: 10}}>
            <Text style={{fontFamily: "monospace", fontSize: 18, color: remainingTimeLow ? "red" : isTimerRunning ? "blue" : undefined}}>{secondsValue === "60" ?  Math.ceil((time/60/1000)) : minutesValue}:{secondsValue == "60" ? "00" : secondsValue}s</Text>
        </View>
    )
}