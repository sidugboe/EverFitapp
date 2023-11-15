import React, { useState, useEffect, useRef } from "react";
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { addOpacityRGB } from "../../../../utils/helpers/colorHelper";
import { default as CommunityIcon } from 'react-native-vector-icons/MaterialCommunityIcons';
import { opacityOnPressed } from "../../../../utils/helpers/colorHelper";
import Icon from 'react-native-vector-icons/MaterialIcons';

const buttonTextColor = "#000000"
const buttonBackgroundColor = "#ffffff"

const EmbeddedItemEditControls = ({ isVisible, setIsVisible, onDelete, onAdd, itemType = "individual" }) => {

    onClosePress = () => {
        setIsVisible(false)
    }

    const onAddItemPress = () => {

    }

    const onDeletePress = () => {
        // todo add confirmation modal
        onDelete();
    }

    return (
        <>
        { isVisible &&
            <View style={{display: 'flex', flexDirection: 'row'}}>
                 <Pressable onPress={onClosePress} style={({pressed}) => [{...styles.AccessoryBarPressable, borderRadius: 20, width: 35, paddingLeft: 0, justifyContent: 'space-around'}]}>
                    { ({pressed}) => (
                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                            <CommunityIcon name={"close"} size={27} style={{borderRadius: 20, paddingHorizontal: 3, color: pressed ? addOpacityRGB(buttonTextColor, .7) : buttonTextColor}}/>
                        </View>
                    )}                        
                </Pressable>
                { itemType == "group" &&
                    <Pressable onPress={onAddItemPress} style={({pressed}) => [{backgroundColor: opacityOnPressed(pressed, buttonBackgroundColor), width: 100, ...styles.AccessoryBarPressable}]}>
                        { ({pressed}) => (
                            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                                <Icon name={"add"} size={25} style={{paddingHorizontal: 3, color: pressed ? addOpacityRGB(buttonTextColor, .7) : buttonTextColor,}}/>
                                <Text style={{color: pressed ? addOpacityRGB(buttonTextColor, .7) : buttonTextColor}}>Add item</Text>
                            </View>
                        )}                        
                    </Pressable>
                }     
                <Pressable onPress={onDeletePress} style={({pressed}) => [{backgroundColor: opacityOnPressed(pressed, buttonBackgroundColor), width: 90, ...styles.AccessoryBarPressable}]}>
                { ({pressed}) => (
                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                        <Icon name={"delete"} size={22} style={{paddingHorizontal: 3, color: pressed ? addOpacityRGB(buttonTextColor, .7) : buttonTextColor}}/>
                        <Text style={{color: pressed ? addOpacityRGB(buttonTextColor, .7) : buttonTextColor}}>Delete</Text>
                    </View>
                )}                        
                </Pressable>
            </View>
        }
        </>
    )

}

const styles = StyleSheet.create({
    AccessoryBarPressable: {
        borderRadius: 14,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        marginHorizontal: 2,
        height: 27,
        paddingLeft: 3,
        marginBottom: 0
    }
});

export { EmbeddedItemEditControls };