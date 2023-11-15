import React, { useState, useEffect } from "react";
import { Text, TextInput, StyleSheet, View } from 'react-native';
import { Modal, Button, VStack, Radio } from "native-base";

const EditCheckInItemModal = ({ isVisible, checkInItem, onClose, onConfirm, confirmButtonText = "Confirm", cancelButtonText = "Cancel", showCancelButton = true }) => {
    const [updatedItem, setUpdatedItem] = useState({ type: "boolean"})
    const [errorMessage, setErrorMessage] = useState("")

    const onUnitsChange = (text) => {
        setUpdatedItem(prev => ({...prev, units: text}))
    }

    const onNameChange = (text) => {
        if(errorMessage)
            setErrorMessage("")
        setUpdatedItem(prev => ({...prev, name: text}))
    }

    const onTypeChange = (value) => {
        if(errorMessage)
            setErrorMessage("")
        setUpdatedItem(prev => ({...prev, type: value}))
    }

    const onFinish = () => {
        // validate input
        if(!updatedItem.name || !updatedItem.type){
            setErrorMessage("Cannot submit because required fields are missing.")
        }
        else {
            // call confirm function
            onConfirm(updatedItem);
        }
    }


    return (
        <Modal isOpen={!!isVisible} onClose={onClose} size="lg">
            <Modal.Content maxWidth="350">
            <Modal.CloseButton />
            <Modal.Header>{checkInItem ? "Edit Check In Item" : "Create Check In Item"}</Modal.Header>
            <Modal.Body>
                <VStack space={3}>
                    <View style={{display: 'flex', flexDirection: 'column'}}>
                        <View style={{display: 'flex', flexDirection: 'column', marginBottom: 15}}>
                            <Text style={{fontWeight: 'bold', fontSize: 18}}>Item Name*</Text>
                            <TextInput defaultValue={checkInItem?.name} onChangeText={onNameChange} style={styles.fieldInput}/>
                        </View>
                        <View style={{display: 'flex', flexDirection: 'column', marginBottom: 15}}>
                            <Text style={{fontWeight: 'bold', fontSize: 18}}>Units</Text>
                            <TextInput editable={checkInItem ? checkInItem.type !== "boolean" : updatedItem.type !== "boolean"} defaultValue={checkInItem ? checkInItem.units ? checkInItem.units : checkInItem.type === "boolean" ? "done/not done" : "" : updatedItem.type === "boolean" ? "done/not done" : ""} onChangeText={onUnitsChange} style={styles.fieldInput}/>
                        </View>
                        <View style={{display: 'flex', flexDirection: 'column', marginBottom: 15}}>
                            <Text style={{fontWeight: 'bold', fontSize: 18}}>Item Type*</Text>
                            { checkInItem ? 
                                <Text style={{fontSize: 13}}>The type cannot be changed after creation</Text>
                                :
                                <Radio.Group name="typeRadioGroup" accessibilityLabel="Item Type" isDisabled={checkInItem} value={updatedItem.type} onChange={onTypeChange}>
                                      <Radio value="boolean" my={1}>
                                        Checkbox
                                      </Radio>
                                      <Radio value="number" my={1}>
                                        Number
                                      </Radio>
                                      <Radio value="string" my={1}>
                                        Text
                                      </Radio>
                                </Radio.Group>
                            }
                        </View>  
                        { errorMessage &&
                            <View>
                                <Text style={{fontSize: 15, color: "red"}}>{errorMessage}</Text>
                            </View> 
                        }            
                    </View>
                </VStack>
            </Modal.Body>
            <Modal.Footer>
                    { showCancelButton && 
                        <Button flex="1" onPress={onClose}>
                            {cancelButtonText}
                        </Button>
                    }
                    <Button flex="1"  marginLeft="5%" onPress={onFinish}>
                    {confirmButtonText}
                    </Button>
            </Modal.Footer>
            </Modal.Content>
        </Modal>
        );
};

const styles = StyleSheet.create({
    fieldInput: {
        backgroundColor: 'lightgrey',
        borderRadius: 8,
        borderWidth: 1,
        width: "80%",
        borderColor: "grey",
        height: 25,
        textAlignVertical: 'top',
        paddingTop: 3,
        paddingBottom: 0
    }
})

export { EditCheckInItemModal };