
import React, { useState, useEffect } from "react";
import { Text, Button, View, ScrollView } from 'react-native';
import styles from "../../stylesheet";
import { ExerciseSimpleCard } from "./ExerciseSimpleCard";

const ExerciseList = ({ exercises, navigation, belongsToUser }) => {

    const onCreateExercisePress = () => {
        navigation.navigate("AddExercise")
    }

    return (
        <ScrollView style={{padding: 5, ...styles.RoutineWorkoutExerciseListContiner}}>
            { exercises?.length ? 
                exercises?.map((exercise, index) => {
                    return (
                        <View style={{paddingVertical: 10}} key={"workout-" + index}>
                            <ExerciseSimpleCard exercise={exercise} navigation={navigation}/>
                        </View>
                    )
            })
            :
            <View style={{margin: 5}}>
                <Text style={{fontSize: 20}}>No exercises yet</Text>
                { belongsToUser &&
                    <TouchableOpacity onPress={onCreateExercisePress} style={{width: "100%", height: 50, borderRadius: 6, borderColor: '#B0B0B0', borderWidth: 2, display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginTop: 20, backgroundColor: "white"}}>
                        <Text style={{fontSize: 20, marginLeft: 15}}>Create Exercise</Text>
                        <View style={{ marginRight: 15}}>
                            <Icon name="add" size={29} style={{padding: 3, paddingTop: 4}}/>
                        </View>
                    </TouchableOpacity>
                }
            </View>
            }            
        </ScrollView>
    )
}

export { ExerciseList };

