import React, { useContext, useState, useEffect, useRef } from "react";
import { Text, TextInput, TouchableOpacity, View, Modal, StyleSheet, Pressable, Keyboard, ScrollView } from 'react-native';
import { Button, ArrowBackIcon, Input, InputLeftAddon, InputGroup, InputRightAddon, Select, CheckIcon, Heading, Checkbox } from 'native-base';
import { ExerciseHistoryCard } from "./ExerciseHistoryCard";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { default as EvilIcon } from 'react-native-vector-icons/EvilIcons'

const ExerciseHistoryOverlay  = ({ selectedExercise, onClose, exerciseLogs }) => {
    const [selectedExerciseLog, setSelectedExerciseLog] = useState("")

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={selectedExercise != ""}
            onRequestClose={onExitCheckList}
            onClose={onExitCheckList}
            style={{height: "80%"}}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Heading style={{margin: 10}}>{selectedExercise.name} - Info</Heading>
                        <View style={{display: "flex", flexDirection: 'row'}}>
                            <Pressable onPress={() => {}} hitSlop={5} style={({pressed}) => [{margin: 7, borderWidth: 0, borderColor: 'lightgrey', backgroundColor: "#ADD8E6", borderRadius: 5, height: 35, width: 50, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}]}>
                                {({pressed}) => (
                                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', height: 25, width: 25}}>
                                        <Icon name="information-outline" size={25} color={"#4990A7"}/>
                                    </View>  
                                )}
                            </Pressable>
                            <Pressable onPress={() => {}} hitSlop={5} style={({pressed}) => [{margin: 7, borderWidth: 0, borderColor: 'lightgrey', backgroundColor: "#ADD8E6", borderRadius: 5, height: 35, width: 50, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}]}>
                                {({pressed}) => (
                                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', height: 25, width: 25}}>
                                        <Icon name="star" size={25} color={"grey"}/>
                                    </View>  
                                )}
                            </Pressable>
                            <Pressable onPress={() => {}} hitSlop={5} style={({pressed}) => [{margin: 7, borderWidth: 0, borderColor: 'lightgrey', backgroundColor: "#ADD8E6", borderRadius: 5, height: 35, width: 50, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}]}>
                                {({pressed}) => (
                                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', height: 25, width: 25, marginLeft: 10}}>
                                        <EvilIcon name="share-apple" size={30}/>
                                    </View>  
                                )}
                            </Pressable>
                        </View>
                        <View style={{width: "100%", display: 'flex', flexDirection: "row", justifyContent: "flex-start", padding: 5}}>
                            <Heading w={75} size={"sm"} height={5} style={{marginleft: 10}}>History</Heading>
                        </View>
                        <ScrollView style={{width: "100%", marginBottom: 7}}>
                            { exerciseLogs.length ? 
                                exerciseLogs.map((log, index) => {
                                    return <ExerciseHistoryCard exerciseLog={log} selectedExercise={selectedExerciseLog} setSelectedExercise={setSelectedExerciseLog} key={"exercise-history-card-" + index}/>
                                })
                                :
                                <View>
                                    <Text>No logs exist for this exercise</Text>
                                </View>

                            }
                        </ScrollView>
                    <View>
                        <Pressable onPress={onClose}>
                            <Text>Close</Text>
                        </Pressable>
                    </View>
                    </View>
                </View>
        </Modal>    
    )
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#00000080'  // this and backgroundColor: #fff give modal backgroudn dimmed effect
    },
    modalView: {
      margin: 10,
      width: "95%",
      height: "80%",
    //   backgroundColor: 'white',
      backgroundColor: '#fff',  // this and backgroundColor: #00000080 give modal background dimmed effect d
      padding: 20,
      borderRadius: 20,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: '#F194FF',
    },
    buttonClose: {
      backgroundColor: '#2196F3',
      marginTop: 13,
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      width: 60
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
  });

export { ExerciseHistoryOverlay };