import React, { useContext, useState, useEffect, useRef } from "react";
import { Text, TouchableOpacit, View } from 'react-native';
import { Modal, Button, ScrollView, Center, VStack, NativeBaseProvider, HStack } from "native-base";

const ConfirmationModal = ({ isVisible, onClose, onConfirm, bodyText, titleText, confirmButtonText = "Confirm", cancelButtonText = "Cancel", showCancelButton = false }) => {
    
    return (
        <Modal isOpen={isVisible} onClose={onClose} size="lg">
            <Modal.Content maxWidth="350">
            <Modal.CloseButton />
            <Modal.Header>
                <View style={{marginTop: 3}}>
                    <Text style={{fontSize: 18}}>{titleText}</Text>
                </View>
                </Modal.Header>
            <Modal.Body>
                <VStack space={3}>
                    <Text>{bodyText}</Text>
                </VStack>
            </Modal.Body>
            <Modal.Footer>
                    { showCancelButton && 
                        <Button flex="1" onPress={onClose}>
                            {cancelButtonText}
                        </Button>
                    }
                    <Button flex="1"  marginLeft="5%" onPress={onConfirm}>
                    {confirmButtonText}
                    </Button>
            </Modal.Footer>
            </Modal.Content>
        </Modal>
        );
};

export { ConfirmationModal };