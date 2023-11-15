import React from "react";
import { Text, View, Modal, StyleSheet } from 'react-native';
import { Spinner } from "native-base";

const LoadingModal = ({ isVisible, title = "Loading" }) => {

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={{display: 'flex', flexDirection: 'column'}}>
                        <Spinner size="lg" />
                        <Text style={{fontSize: 30}}>{title}</Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
}


const styles = StyleSheet.create({
    centeredView: {
      flex: 1,  // without this other modawl interferes
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      width: "75%",
      height: "25%",
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
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around'
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

export { LoadingModal };