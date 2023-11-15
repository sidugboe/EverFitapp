import React, { useState, useEffect, useRef } from "react";
import { Center, Button, View, ScrollView, Text, Pressable, ArrowForwardIcon, HStack} from 'native-base';
import {FrequencyAnalytics} from "./FrequencyAnalytics";
import {PersonalRecords} from "./PersonalRecords";

/*
    MyProgress
    1. Frequency Analytics
        a. Timeline >> User sets start and end of scope dates
        b. Workouts (any) timeline and 1D heat map
        c. Metrics
            i.      Average workouts/week
            ii.     Workouts/rest day
            iii.    Average exercises (or sets?) per week
            iv.     Average weekly weight +/-
            v.      Muscle Group Heatmap
        d. Share
    2. Personal Record Analytics (All time) >> Search by exercise
        a. First try/lift >> date, weight
        b. All time PR
        c. Progress Graph
        d. Share
    3. Link to all logs db
*/

const AnalyticsPage = (props) => {
    const { navigation } = props
    const scrollRef = useRef();

    const onViewAllLogPress = () => {
        navigation.navigate("WorkoutLogs")
    }

    const onBTTPress = () => {
        scrollRef.current?.scrollTo({
            y: 0,
            animated: true,
          });
    }

    return(
        <View>
            <ScrollView ref={scrollRef}>
                <Center p='2'>
                    <Text fontSize='4xl' fontWeight={600} color='pink.500'>
                        EverFit Analytics
                    </Text>
                </Center>

                <Center>
                    <FrequencyAnalytics/>
                    <PersonalRecords/>
                    <Button onPress={onViewAllLogPress} rounded="15" variant="outline" minH='50' my='2'>
                        <Center>
                            <HStack alignItems='center'>
                                <Text fontSize='md' m='2'>View All Workout Logs</Text>
                                <ArrowForwardIcon/>
                            </HStack>
                        </Center>
                    </Button>

                    <Pressable mb='2' height={25} onPress={onBTTPress}>
                        <Text color="pink.500" underline>Back to Top</Text>
                    </Pressable>
                </Center> 
            </ScrollView>
        </View>
    )
}

export {AnalyticsPage};
