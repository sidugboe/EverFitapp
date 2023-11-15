import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { Text } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const WhiteGreyBlackPicker = ({ onColorChange, selectedColor = "black" }) => {
    const colorOptions = ["black", "grey", "white"]

    return (
        <View style={{ display: 'flex', flexDirection: 'column', marginLeft: "10%", marginTop: 10}}>
            <View style={{display: "flex", flexDirection: 'row'}}>
                { colorOptions.map((color) => {
                
                    const isSelected = color === selectedColor
                    
                    return (
                        <Pressable onPress={() => onColorChange(color)} hitSlop={5} style={({pressed}) => [{ marginHorizontal: 5}]} key={"color-picker-" + color}>
                            {({pressed}) => (
                                <View style={{backgroundColor: color, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', height: 25, width: 25, borderRadius: 7, borderColor: color === "white" ? "grey" : undefined, borderWidth: 1}}>
                                    { isSelected &&
                                        <Icon name="check" color={color === "white" ? "black" : "white"} style={{}} size={22}/>
                                    }
                                </View>  
                            )}
                        </Pressable>
                    )
                })}
            </View>
            <Text style={{fontSize: 13, color: '#696969', width: '80%', marginTop: 5}}>The color of the display text when this item is shared.</Text>
        </View>
    );
}

export { WhiteGreyBlackPicker }