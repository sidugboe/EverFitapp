import React, { useState, useEffect, useRef } from "react";
import { Center, View, ScrollView, Text, TouchableOpacity, Pressable, Modal, TextInput} from 'react-native';
import { useRoutines } from "../../services/routineService";
import { useWorkouts } from "../../services/workoutService";
import { TrainingLibraryItem } from "./TrainingLibraryItem";
import { useExercises } from "../../services/exerciseService";
import { Input, Button } from "native-base";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ConfirmationModal } from "../modal/ConfirmationModal";
import { SelectOptionModal } from "../modal/SelectOptionModal";

const DEFAULT_FILTER_ITEMS = ["routine", "workout", "exercise"]

/**
 * 
 * @param {mode} mode the library is in. Modes are "View" -> selecting item takes you to view screen for it, "select" -> an item can be selected, "selectMultiple" -> multiple items can be selected 
 * @param {itemType} the type of item shown in the list, whether all or to specify a single type provide string: "routine", "workout", or "exercise" 
 * @returns 
 */
const TrainingLibraryOverlay = ({ isVisible, onClose, navigation, itemType, mode, shouldConfirm = true, onConfirmItems, confirmationModalTitle, confirmationModalBody }) => {

    // hooks    
    const { routines } = useRoutines(/*USER_ID*/);
    const { workouts } = useWorkouts(/*USER_ID*/);
    const { exercises } = useExercises(/*USER_ID*/);
    const searchBar = useRef(0)

    // component state
    const [libraryItems, setLibraryItems] = useState([]);
    const [isSearchBarShown, setIsSearchBarShown] = useState(false);
    const [filteredLibraryItems, setFilteredLibraryItems] = useState([]);
    const [isSearchFilterApplied, setIsSearchFilterApplied] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [typesShown, setTypesShown] = useState(itemType ? [itemType] : DEFAULT_FILTER_ITEMS)
    const [isCreateTypeModalOpen, setIsCreateTypeModalOpen] = useState(false)

    // confirmation modal state
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

    const sortFunction = (a, b) => {
        if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
    }

    useEffect(() => {
        // note adjust to fix case when these collecions exit but have no items - will break!
        if(routines?.length || workouts?.length || exercises?.length){
            let filteredLibraryItems;

            // only show types that the library has been filtered to show
            if(typesShown){
                filteredLibraryItems = [... typesShown.includes("routine") ? routines.map((item) => ({...item, type: "Routine"})) : [], ... typesShown.includes("workout") ? workouts.map((item) => ({...item, type: "Workout"})) : [], ... typesShown.includes("exercise") ? exercises.map((item) => ({...item, type: "Exercise"})) : []].sort(sortFunction);
            }
            setLibraryItems(filteredLibraryItems)
        }
    }, [routines?.length, workouts?.length, exercises?.length, isVisible, typesShown])

    // fixes issue when library overlay opened and closed with 2 dif itemtypes from the same screen
    useEffect(() => {
        if(itemType === ""){
            setTypesShown(DEFAULT_FILTER_ITEMS)
        }
        else
            setTypesShown(itemType)

        // clear selected items on close
        if(!isVisible)
            setSelectedItems([])
    }, [isVisible])

    const onSearchTextChange = (text) => {
        setIsSearchFilterApplied(true);
        setFilteredLibraryItems(libraryItems.filter(item => item.name.toLowerCase().includes(text.toLowerCase())))
    }

    const onSearchClear = () => {
        setIsSearchFilterApplied(false);
        searchBar.current.clear();
        searchBar.current.blur();
    }

    const onCardSelect = (item, isBeingSelected) => {

            // if it's being selected
            if(isBeingSelected){
                if(mode === "selectMultiple")
                    setSelectedItems(prev => [...prev, item])
                else if(mode === "select")
                    setSelectedItems([item])
                else if(mode === "view")
                    alert("navigation to view screen coming soon")
            }
            // else if it's being unselected
            else if(!isBeingSelected){
                setSelectedItems(prev => prev.filter(i => i._id?.toString() !== item?._id?.toString()))
            }
        }

        const promptConfirmation = () => {
            // close modal if shouldn't confirm
            if(!shouldConfirm || !confirmationModalTitle){
                handleClose();
            }
            else {
                setIsConfirmationModalOpen(true);
            }
        }

        const onConfirmAdd = () => {
            handleClose();
        }

        // called when the user click on a item type to show/hide it
        // todo update pressables so unselected ones stay right
        // also fix flicker when clicking them caused by conflicty between state and pressable 'pressed' property
        const onFilterItemPress = (itemType, shouldShow) => {
            if(shouldShow)
                setTypesShown(prev => [...typesShown, itemType]);
            else
                setTypesShown(prev => prev.filter(item => item !== itemType));
        }

        const handleCreateItem = (itemType) => {
            setTimeout(() => onClose(), 2000)
            navigation.navigate("Add" + itemType)
        }

        const handleClose = () => {
            // close the modal and overlay and do whatever
            if(isConfirmationModalOpen)
                setIsConfirmationModalOpen(false);
            
            // todo combine onClose and onConfirmItems
            onClose();
            onConfirmItems(selectedItems);
            setSelectedItems([])
        }

        const closeWithoutAdding = () => {
            onClose();
            setSelectedItems([])
        }
        
        return (
            <Modal visible={isVisible} onRequestClose={closeWithoutAdding} onDismiss={closeWithoutAdding} height={"50%"} animationType="slide">
                <>
                    <View style={{ borderBottomWidth: 1.5, display: 'flex', flexDirection: 'column', minHeight: "11%", padding: 10}}>
                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                            <View style={{alignSelf: "center", marginLeft: "30%", marginRight: 0, display: "flex", flexDirection: 'row', alignItems: 'center', marginRight: 5, justifyContent: 'flex-end', marginBottom: 10}}>
                                <TextInput onChangeText={onSearchTextChange} ref={searchBar} placeholder={"search"} style={{ backgroundColor: 'lightgrey', width: "90%", height: 35, borderRadius: 12, borderColor: "#BEBEBE", borderWidth: 1, paddingTop: 0, paddingBottom: 0}}/>
                                { isSearchFilterApplied &&
                                    <TouchableOpacity onPress={onSearchClear}>
                                        <Icon name="close" size={25} style={{ paddingLeft: 1, paddingTop: 1, marginTop: 1, borderRadius: 50}}/>
                                    </TouchableOpacity>
                                }   
                            </View>
                            <View style={{ marginRight: 5}}>
                                <TouchableOpacity onPress={() => setIsCreateTypeModalOpen(true)}>
                                    <Icon name="add" size={29} style={{padding: 3, paddingTop: 4}}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{width: "100%", display: 'flex', flexDirection: 'row'}}>
                            { DEFAULT_FILTER_ITEMS.map((itemType, index) => {  

                                // if item is already being shown we don't want it in the list of items user can click to show
                                let isShown = typesShown.includes(itemType);

                                return (
                                    <Pressable onPress={() => onFilterItemPress(itemType, !isShown)} hitSlop={5} key={"filter-item-hidden-" + index} style={({pressed}) => [{ backgroundColor: ((isShown && pressed) || (!isShown && !pressed)) ? '#BEBEBE' : "#3F98D8", borderRadius: 20, marginRight: 2, height: 20, paddingHorizontal: 6, display: "flex", flexDirection: 'row',alignItems: "center", minWidth: 23, justifyContent: "space-around"}]}>
                                        <Text style={{fontSize: 11, color: 'white'}}>{itemType + "s"}</Text>
                                    </Pressable>
                                )
                            })}
                        </View>
                    </View>
                    <ScrollView style={{ minHeight: "20%"}}>
                        { (isSearchFilterApplied ? filteredLibraryItems?.length : libraryItems?.length) ? (isSearchFilterApplied ? filteredLibraryItems : libraryItems)?.map((item, index) => {
                            let isSelected = selectedItems.filter(i => i._id?.toString() == item._id?.toString()).length > 0

                            return (
                                <TrainingLibraryItem item={item} isSelected={isSelected} mode={mode} navigation={navigation} onCardSelect={onCardSelect} key={"library-item-" + index}/>
                            );
                        })
                        :
                        <Text>There are items here</Text>}
                    </ScrollView>
                    { (mode !== "view" && selectedItems?.length !== 0) &&
                        <Button height={"8%"} margin={"2%"} onPress={promptConfirmation}><Text style={{fontSize: 20, color: "white"}}>{mode === "selectMultiple" ? `Select Items (${selectedItems?.length})`: "Select Item"}</Text></Button>
                    }

                    <SelectOptionModal isVisible={isCreateTypeModalOpen} onClose={() => setIsCreateTypeModalOpen(false)} titleText={"Select item type to create"} options={["Routine", "Workout", "Exercise"]} onOptionPress={handleCreateItem} />
                    <ConfirmationModal onConfirm={onConfirmAdd} isVisible={isConfirmationModalOpen} onClose={() => setIsConfirmationModalOpen(false)} showCancelButton={true} titleText={confirmationModalTitle} bodyText={confirmationModalBody}/>
                </>
            </Modal>
        )
}

export { TrainingLibraryOverlay };