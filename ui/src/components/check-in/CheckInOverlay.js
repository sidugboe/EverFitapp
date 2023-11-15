import React, { useState, useEffect } from "react";
import { Text, TextInput, View, Modal, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useToast, Heading, Checkbox } from 'native-base';
import { useCheckInItems } from "../../services/checkInItemService";
import { useCheckInItemLogs } from "../../services/checkInItemLogService";
import { getDateInfo, getTimeUntilEndOfDay } from "../../utils/helpers/dateHelper";
import { OpacityIcon } from "../generic/OpacityIcon";
import { EditCheckInItemModal } from "../modal/EditCheckInItemModal";
import { ConfirmationModal } from "../modal/ConfirmationModal";
import { areSameDay } from "../../utils/helpers/dateHelper";

const USER_ID_DEV_USER = "63d1da36d4792fc5c52045cf";

const CheckInOverlay = ({ isVisible, onClose }) => {

    // component state
    const [isKeyboardVisible, setKeyboardVisible] = useState(true);
    const [checkInItemValues, setCheckInItemValues] = useState([]);
    const [isEditModeEnabled, setIsEditModeEnabled] = useState(false)
    const [isEditItemModalOpen, setIsEditItemModalOpen] = useState({});
    const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState("")
    
    // hook call for check in items
    const toast = useToast()
    const { userCheckInItems, createCheckInItem, deleteCheckInItem, editCheckInItem, refetchUserCheckInItems, isLoading: isLoadingUserCheckInItems } = useCheckInItems(USER_ID_DEV_USER);
    const { userCheckInItemLogs, createCheckInItemLog, editCheckInItemLog, refetchUserCheckInItemLogs, isLoading: isLoadingUserCheckInItemLogs} = useCheckInItemLogs(USER_ID_DEV_USER);

    useEffect(() => {
        // get all check in items and their values (checked or unchecked etc, from todays logs) to populate the checklist
        if(!isLoadingUserCheckInItems && !isLoadingUserCheckInItemLogs){
            let dateToday = new Date();
            let logValues = []

            // for each check in item log from today, map to correspondinbg check in item
            for(let itemLog of userCheckInItemLogs){
                if(areSameDay(itemLog?.date, dateToday)){
                    logValues.push({ checkInTemplate: itemLog?.checkInTemplate?._id, value: itemLog?.value, logId: itemLog?._id})
                }
            }

            // apply these log values to state so that items will show the values
            setCheckInItemValues(logValues)
        }
    }, [isLoadingUserCheckInItems, isLoadingUserCheckInItemLogs])

    onExitCheckList = () => {
        // exit modal
        onClose();
    }

    /**
     * Called when the user a check in item value. This method works for both checkbox types and input types
     * @param {string} newValue the new value, whether checked or unchecked (for checkbox types) or a string value for input types
     * @param {CheckInItem} checkInItem the check in item that is being changed
     * @param {Object} logId the id log item tied to the check in item for TODAY. If there is no existing log item this for today, this id value will be empty so we need to create a new log, otherwise we must edit the current one.
     */
    const onItemValueChange = async (newValue, checkInItem, logId) => {

        // temporarily edit the LOCAL check in item values so the updated value is shown immeditely while we wait for the db data to be updated and re fteched from the db
        let newItemValues = checkInItemValues.map(item => item.checkInTemplate === item._id ? {...item, value: newValue} : item)
        setCheckInItemValues(newItemValues);

        let res;

        // if a log already exists for this item we need to update it, otherwise create a new log
        if(logId){
            res = await editCheckInItemLog({ _id: logId, checkInTemplate: checkInItem._id, type: checkInItem.type, value: checkInItem.type === "number" ? parseFloat(newValue) : newValue })
        }
        else {
            res = await createCheckInItemLog({ checkInTemplate: checkInItem._id, type: checkInItem.type, value: checkInItem.type === "number" ? parseFloat(newValue) : newValue })
        }

        if(res?.message?.toLowerCase().includes("success")){
            
            // show toast but not working

            // refetch data so item is no longer shown
            refetchUserCheckInItemLogs();
        }
    }

    const onCreateItem = () => {
        setIsEditItemModalOpen({ isOpen: true })
    }

    const onDeletePress = (item) => {
        setIsDeleteConfirmationModalOpen(item._id)
    }

    const deleteItem = async () => {
        // close the modal
        setIsDeleteConfirmationModalOpen("")

        // delete the item
        let res = await deleteCheckInItem(isDeleteConfirmationModalOpen)

        if(res.message?.toLowerCase().includes("success")){
            
            // show toast but not working

            // refetch data so item is no longer shown
            refetchUserCheckInItems();
        }
    }

    const onEditPress = (item) => {
        setIsEditItemModalOpen({ isOpen: true, item: item})
    }

    const onConfirmItemEdit = async (updatedItem) => {

        // if item has an id we are editing
        if(updatedItem._id){
            // send post request to update checklist item
            let res = await editCheckInItem(updatedItem);

        }
        else { // else create
            let res = await createCheckInItem(updatedItem)

            if(res.message?.toLowerCase().includes("success")){

                // todo toast show isn't working over modal for some reason
                // show success toast
                toast.show({
                    description: "Item Successfully Created",
                    duration: 2000
                })

                // update items so new item is shown
                refetchUserCheckInItems();
            }
        }
        // close the modal
        setIsEditItemModalOpen({ isOpen: false })
    }

    const renderItem = (item) => {
            let itemLog = checkInItemValues.filter(logFromToday => logFromToday.checkInTemplate === item._id)
            let itemLogExists = itemLog.length !== 0                // if a log from today exists for this item
            let itemValue = itemLogExists ? itemLog[0].value : ""   // the value of the log (from today) tied to the check in item (if value has been saved today)
            let itemLogId = itemLogExists ? itemLog[0].logId : ""   // the id of the log (from today) tied to the check in item (if one exists)

            return (
                <View style={{marginBottom: 10, display: 'flex', flexDirection: 'row'}}>
                    { item.type === "boolean" ?
                        <View style={{display: 'flex', flexDirection: 'row'}}>
                            <Checkbox size="sm" defaultIsChecked={itemValue} onChange={(isChecked) => onItemValueChange(isChecked, item, itemLogId)}>
                                <Text style={{fontSize: 25, paddingBottom: 4}}>{item.name}</Text>
                            </Checkbox>
                            {editModeDetails(item)}
                        </View>
                        :
                        <View>
                            { (item.type === "number") ?
                                <View style={{display: 'flex', flexDirection: 'column'}}>
                                    <View style={{display: 'flex', flexDirection: 'row'}}>
                                        <Text style={{fontSize: 20}}>{item.name}</Text>
                                        {editModeDetails(item)}
                                    </View>
                                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-end'}}>
                                        <TextInput defaultValue={itemValue + ""} keyboardType={"numeric"} onEndEditing={(event) => onItemValueChange(event.nativeEvent.text, item, itemLogId)} style={styles.fieldInput}/>
                                        <Text style={{fontSize: 18}}>{item.units}</Text>
                                    </View>
                                </View>
                            :
                                <View style={{display: 'flex', flexDirection: 'column'}}>
                                    <View style={{display: 'flex', flexDirection: 'row'}}>
                                        <Text style={{fontSize: 25}}>{item.name}</Text>
                                        {editModeDetails(item)}
                                    </View>
                                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-end'}}>
                                        <TextInput defaultValue={itemValue} keyboardType={"numeric"} onEndEditing={(event) => onItemValueChange(event.nativeEvent.text, item, itemLogId)} style={styles.fieldInput}/>
                                        <Text style={{fontSize: 18}}>{item.units}</Text>
                                    </View>
                                </View>
                            }
                        </View>
                    }
                </View>
            )
    }

    const editModeDetails = (item) => (
        <>
            { isEditModeEnabled &&
                <>
                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 5}}>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: "center", marginRight: 3, height: "100%"}}>
                            <OpacityIcon name={"edit"} size={20} onPress={() => onEditPress(item)} iconType="material"/>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: "center", marginRight: 3, height: "100%"}}>
                            <OpacityIcon name={"delete"} size={20} onPress={() => onDeletePress(item)} iconType="material"/>
                        </View>
                    </View>
                </>
            }
        </>
    )

    return (
        <>
            <Modal
                animationType="fade"
                transparent={true}
                visible={isVisible}
                onRequestClose={onExitCheckList}
                onClose={onExitCheckList}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Heading>Daily Check In</Heading>
                        <Text style={{fontSize: 18}}>{getDateInfo(new Date())}</Text>
                        <View style={{width: '100%', marginRight: 0}}>
                            <ScrollView style={{width: "100%", height: "70%", backgroundColor: "#E0E0E0", paddingLeft: "5%", paddingTop: "4%", borderRadius: 13, paddingHorizontal: 5}} contentContainerStyle={{paddingBottom: 10}}>
                                { userCheckInItems?.length ? userCheckInItems?.map((item, index) => {

                                    return (
                                        <View key={"checklist-item-" + index}>
                                            <View>
                                            {renderItem(item)}
                                            </View>
                                        </View>
                                    );
                                })
                                :
                                <Text>No items yet</Text>
                                }
                            </ScrollView>
                            <View style={{marginLeft: 5}}>
                                <Text>Form resets in {getTimeUntilEndOfDay()}</Text>
                            </View>
                        </View>
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                        { isEditModeEnabled ? 
                            <>
                                <Pressable style={[styles.button, styles.buttonEdit]} onPress={onCreateItem}>
                                    <Text style={{ ...styles.textStyle, ...styles.textStyleButtonEdit, width: 100 }}>New Item</Text>
                                </Pressable>
                                <Pressable style={[styles.button, styles.buttonClose, {marginLeft: 10}]} onPress={() => setIsEditModeEnabled(false)}>
                                    <Text style={styles.textStyle}>Done</Text>
                                </Pressable>
                            </>
                            :
                            <>
                                <Pressable style={[styles.button, styles.buttonEdit]} onPress={() => setIsEditModeEnabled(true)}>
                                    <Text style={{ ...styles.textStyle, ...styles.textStyleButtonEdit, width: 80 }}>Edit Items</Text>
                                </Pressable>
                                <Pressable style={[styles.button, styles.buttonClose, {marginLeft: 10}]} onPress={onExitCheckList}>
                                    <Text style={styles.textStyle}>Close</Text>
                                </Pressable>
                            </>
                        }
                    </View>
                    </View>
                </View>
            </Modal>
            <EditCheckInItemModal isVisible={isEditItemModalOpen?.isOpen} checkInItem={isEditItemModalOpen.item} onConfirm={onConfirmItemEdit} onClose={() => setIsEditItemModalOpen({ isOpen: false})}/>
            <ConfirmationModal isVisible={!!isDeleteConfirmationModalOpen} onClose={() => setIsDeleteConfirmationModalOpen("")} onConfirm={deleteItem} bodyText={"Are you sure you want to remove this check in item?"} titleText={"Delete Check In Item"} showCancelButton={true}/>
        </>
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
      margin: 25,
      width: "95%",
      height: "95%",
      backgroundColor: 'lightgrey',
      borderRadius: 20,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      display: 'flex',
      flexDirection: 'column',
      justifyContent: "space-between",
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    buttonOpen: {
      backgroundColor: '#F194FF',
    },
    buttonClose: {
      backgroundColor: '#2196F3',
      marginTop: 13,
    },
    buttonEdit: {
        backgroundColor: '#F0F0F0',
        marginTop: 13,
      },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      width: 60
    },
    textStyleButtonEdit: {
        color: '#2196F3'
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
    fieldInput: {
        borderRadius: 8,
        borderWidth: 1,
        width: "60%",
        height: 30,
        textAlignVertical: 'top',
        paddingTop: 5,
        paddingBottom: 0,
        backgroundColor: "white", 
        fontSize: 15,
        borderRadius: 10, 
        marginRight: 10,
        borderColor: "lightgrey",
        marginTop: 5
    }
});

export { CheckInOverlay };