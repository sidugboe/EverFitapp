import React, { useState, useEffect, useRef } from "react";
import { Center, Button, View, Text, Pressable, TextInput, KeyboardAvoidingView, Keyboard, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { default as CommunityIcon } from 'react-native-vector-icons/MaterialCommunityIcons';
import { default as IonIcon } from 'react-native-vector-icons/Ionicons';
import { EmbeddedRoutine } from "./EmbeddedRoutine";
import { EmbeddedWorkout } from "./EmbeddedWorkout";
import { EmbeddedExercise } from "./EmbeddedExercise";
import { EmbeddedItemEditControls } from "./EmbeddedItemEditControls";
import { pSBC } from "../../../../utils/helpers/colorHelper";

const NESTING_BACKGROUND_COLORS = {
    0: "#D3D3D3",
    1: "#C8C8C8",
    2: "#F0F0F0",
    3: "#E0E0E0", // max nesting would be 3 being: group (0) > routine (1) > workout (2) > exercise (3)
    4: "#F8F8F8",
}

// unsure of which style to choose out of the two, flicker on press/hold or not (no flicker looks better but doesn't indicate hold to edit)
const STYLE_MODE = 0

const EmbeddedItemGroup = ({ itemType, items, onDelete, itemCreators }) => {
    const [isGroupExpanded, setIsGroupExpanded] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)

    const onGroupPress = () => {
        setIsGroupExpanded(prev => !prev)
        setIsEditMode(false)
    }
    
    const renderChildItems = () => {
        if(itemType == "routine"){
            return items.map((item, index) => {

                return (
                    <EmbeddedRoutine creator={itemCreators[item._id]} item={item} isNested={1} key={"embedded-routine-l1-" + item._id}/>
                )
            })
        }
        else if(itemType == "workout"){
            return items.map((item, index) => {

                return (
                    <EmbeddedWorkout creator={itemCreators[item._id]} item={item} isNested={1} key={"embedded-workout-l1-" + item._id}/>
                )
            })
        } else if(itemType == "exercise"){
            return items.map((item, index) => {

                return (
                    <EmbeddedExercise creator={itemCreators[item._id]} item={item} isNested={1} key={"embedded-exercise-l1-" + item._id}/>
                )
            })
        }
    }

    const onLongPress = () => {
        setIsEditMode(true)
    }

    return (
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
            <View style={{display: 'flex', flexDirection: 'column', width: '98%'}}>
                <View style={{display: 'flex', flexDirection: 'column', alignItems: "center", backgroundColor: NESTING_BACKGROUND_COLORS[0], borderRadius: 10, paddingBottom: isGroupExpanded ? 10 : 0, width: "100%"}}>
                    <Pressable onLongPress={onLongPress} onPress={onGroupPress} style={({pressed}) => STYLE_MODE === 1 ? [{ display: 'flex', flexDirection: 'column', width: "95%"}] : [{ borderRadius: 10, display: 'flex', flexDirection: 'column', width: "100%", paddingHorizontal: "2.5%", backgroundColor: (pressed && !isGroupExpanded) ? pSBC(.7, NESTING_BACKGROUND_COLORS[0]) : undefined}]}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 5, paddingTop: 2}}>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 5, paddingTop: 2, width: "80%"}}>
                                <IonIcon size={50} name="ios-albums-outline" style={{marginRight: 10}}/>
                                <Text style={{fontSize: 16}}>Item Group: {items.length + " " + itemType + "s"}</Text>
                            </View>
                            <CommunityIcon name={isGroupExpanded ? "chevron-down" : "chevron-right"} size={35} style={{marginRight: 20}}/>
                        </View>
                    </Pressable>
                    { isGroupExpanded &&
                        <View  style={{ borderRadius: 10}}>
                            {renderChildItems()}
                        </View>
                    }
                </View>
                { isEditMode &&
                    <EmbeddedItemEditControls isVisible={isEditMode} setIsVisible={setIsEditMode} onDelete={onDelete}/>
                }
            </View>
        </View>
    );
}

export { EmbeddedItemGroup };