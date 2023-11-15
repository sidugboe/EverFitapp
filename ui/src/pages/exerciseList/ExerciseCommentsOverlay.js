import React, { useContext, useState, useEffect, useRef } from "react";
import { Text, TextInput, TouchableOpacit, View, Modal, StyleSheet, Pressable, Keyboard } from 'react-native';
import { Heading } from 'native-base';

const WEIGHT_UNITS = "lbs"

const ExerciseCommentsOverlay = ({ isVisible, onClose, onCommentsChange, exerciseComments }) => {
    const [isKeyboardVisible, setKeyboardVisible] = useState(true);
    const input = useRef(0);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true); // or some other action
            }
        );

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false); // or some other action
                input?.current?.blur?.();
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
            onClose={onClose}>
            <View style={styles.centeredView}>
            <View style={styles.modalView}>
                {/* { !isKeyboardVisible && <Heading fontSize={20} alignSelf="flex-start" marginLeft={4}>Exercise Comments:</Heading> } */}
                <TextInput defaultValue={exerciseComments} onChangeText={onCommentsChange} ref={input} multiline={true} scrollEnabled={true} style={{borderWidth: 1, borderColor: "#DEDEDE", backgroundColor: "#DDDDDD", width: "100%", height: "70%", borderRadius: 20}}></TextInput>
                { !isKeyboardVisible && 
                    <Pressable style={[styles.button, styles.buttonClose]} onPress={onClose}>
                        <Text style={styles.textStyle}>Done</Text>
                    </Pressable>
                }
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
      marginTop: 10,
    },
    modalView: {
      margin: 10,
      width: "95%",
      height: "40%",
      backgroundColor: 'white',
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

export { ExerciseCommentsOverlay };

