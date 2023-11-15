import React, { useContext, useState, useEffect, useRef } from "react";
import { Pressable, Text, View } from 'react-native';
import { Modal, Button, ScrollView, Center, VStack, Spacer, HStack, CircleIcon } from "native-base";

const SelectOptionModal = ({ isVisible, onClose, titleText, options, onOptionPress, cancelButtonText = "Cancel", showCancelButton = true }) => {
    const assignColour = (entity) => {
        if (entity.toLowerCase() == "routine")
            return ('amber.500')
        else if (entity.toLowerCase() == "workout")
            return ('green.500')
        else if (entity.toLowerCase() == "exercise")
            return ('blue.500')
        else
            return ('muted')
    }

    return (
        <Modal isOpen={isVisible} onClose={onClose} size="lg">
            <Modal.Content maxWidth="350">
            <Modal.CloseButton />
            <Modal.Header>{titleText}</Modal.Header>
            <Modal.Body>
                <VStack space={2}>
                    { options?.map((option, index) => (
                        <Pressable onPress={() => onOptionPress(option)} style={({pressed}) => [{backgroundColor: pressed ? "lightgrey" : undefined, padding: 5, borderRadius: 6}]} key={"modal-option-" + index}>
                            <HStack>
                                <CircleIcon mr='5' color={assignColour(option)}/>
                                <Text>{option}</Text>
                            </HStack>
                        </Pressable>
                    ))}
                </VStack>
            </Modal.Body>
            <Modal.Footer>
                { showCancelButton && 
                    <Button flex="1" marginLeft="5%" onPress={onClose}>
                        {cancelButtonText}
                    </Button>
                }
            </Modal.Footer>
            </Modal.Content>
        </Modal>
        );
};

export { SelectOptionModal };