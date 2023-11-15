import React, { useContext, useState, useEffect, useRef } from "react";
import { Text, TextInput, TouchableOpacity, View, Modal, StyleSheet, Pressable, Keyboard, ScrollView } from 'react-native';
import { Button, ArrowBackIcon, Input, InputLeftAddon, InputGroup, InputRightAddon, Select, CheckIcon, Heading, Checkbox } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { default as EvilIcon } from 'react-native-vector-icons/EvilIcons'
import { accelerometer, gyroscope, setUpdateIntervalForType, SensorTypes } from "react-native-sensors";


const AutoTrackModal = ({ isVisible, onClose }) => {
    const [hasTrackingStarted, setHasTrackingStarted] = useState(false)
    const [reps, setReps] = useState(0);

    // runs on ititial render to setup the subscription and calls the callback on unmount to remove subscription
    useEffect(() => {
        let accelerometerSubscription;
        if(isVisible){
            accelerometerSubscription = accelerometer.subscribe(({ x, y, z, timestamp }) =>
            handleAccelerometerData(x,y,z,timestamp));    
        }
        else {
            accelerometerSubscription?.unsubscribe?.()
        }

        return () => {
            accelerometerSubscription?.unsubscribe();
        }
    }, [isVisible])

    /**
     * Function that handles reading the accelerometer data 
     * @param {*} x 
     * @param {*} y 
     * @param {*} z 
     * @param {*} timestamp 
     */
    const handleAccelerometerData = (x, y, z, timestamp) => {
        let isFullRep = false;

        // ... some logic
        
        // increase number of reps once a full rep has been observed
        if(isFullRep)
            setReps(prev => prev + 1)
    }

    /**
     * Function called when user presses reset button - should reset tracking info
     */
    const onResetPress = () => {
        setReps(0)
    }

    /**
     * Function called when user presses start button - should start tracking data
     */
    const onStartPress = () => {
        setHasTrackingStarted(true)
    }

    /**
     * Function called when user presses stop button - should stop tracking and pass rep data to parent
     */
    const onStopPress = () => {
        setHasTrackingStarted(false);

        // send data
        //onClose(reps)
    }

    /**
     * Funciton called on modal close press - should send reps value back to parent component
     */
    const onModalClose = () => {
        let reps = 0;

        // reset modal data and close
        setHasTrackingStarted(false)
        onClose(reps)
        setReps(0)
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onModalClose}
            onClose={onModalClose}
            style={{height: "80%"}}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Heading style={{margin: 10}}>AutoTrack</Heading>
                        <View style={{display: "flex", flexDirection: 'row'}}>
                            <Pressable onPress={onResetPress} hitSlop={5} style={({pressed}) => [{margin: 7, borderWidth: 0, borderColor: 'lightgrey', backgroundColor: "#ADD8E6", borderRadius: 5, height: 35, width: 80, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}]}>
                                {({pressed}) => (
                                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                                        <Text style={{fontSize: 20}}>Reset</Text>
                                    </View>  
                                )}
                            </Pressable>
                        </View>
                        <View style={{width: "100%", display: 'flex', flexDirection: "row", justifyContent: "space-around", padding: 10}}>
                            { hasTrackingStarted ?
                                <>
                                    <Pressable onPress={onStopPress} hitSlop={5} style={({pressed}) => [{margin: 7, borderWidth: 0, backgroundColor: "#0096FF", borderRadius: 250, height: 250, width: 250, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}]}>
                                        {({pressed}) => (
                                            <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around'}}>
                                                    <Text style={{fontSize: 40, color: "white"}}>Stop</Text>
                                                    <Text style={{fontSize: 30, color: "white"}}>{reps} reps</Text>
                                                </View>
                                            </View>
                                        )}
                                    </Pressable>
                                </>
                                :
                                <>
                                    <Pressable onPress={onStartPress} hitSlop={5} style={({pressed}) => [{margin: 7, borderWidth: 0, backgroundColor: "#0096FF", borderRadius: 250, height: 250, width: 250, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}]}>
                                        {({pressed}) => (
                                            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                                                <Text style={{fontSize: 40, color: "white"}}>Start</Text>
                                            </View>  
                                        )}
                                    </Pressable>
                                </>
                            }
                        </View>
                    <View>
                        <Pressable onPress={onModalClose}>
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

export { AutoTrackModal };