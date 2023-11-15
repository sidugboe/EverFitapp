import React, { useState, useEffect, useRef } from "react";
import { Center, Button, View, ScrollView, Text, TextInput, Pressable, Keyboard} from 'react-native';
import { NewMessageHeader } from "../../../components/appbars/NewMessageHeader";
import { default as IonIcon } from 'react-native-vector-icons/Ionicons'
import { addOpacityRGB, opacityOnPressed } from "../../utils/helpers/colorHelper";
/**
 * Search bar with icon
 * @param {*} param0 
 * @returns 
 */
const IconSearchBar = ({ name, size = 20, color = "rgb(150, 150, 150)", style, onChangeText, onCancel }) => {
    const [searchInput, setSearchInput] = useState("")
    const [isInputFocused, setIsInputFocused] = useState(false)
    const inputRef = useRef(0);

    // programatically fixes issue where android keyboard dismiss with back button doesn't unfocus from input so pressing input again doesn't re-focus input - so manually unfocus on keyboard close
    useEffect(() => {
        const kListener = Keyboard.addListener('keyboardDidHide', () => {
          Keyboard.dismiss();
        });
    
        return () => {
          kListener.remove();
        };
    }, []);

    const onInputChange = (text) => {
        setSearchInput(text)
        onChangeText(text)
    }

    const onPressIn = () => {
        setIsInputFocused(true)
    }

    onCancelPress = () => {
        inputRef.current.setNativeProps({ text: "" })   // remove text from the input
        Keyboard.dismiss();
        inputRef?.current?.blur();
        onCancel();
    }

    return (
        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', paddingRight: '5%', paddingBottom: 5}}>
            <Pressable onPress={() => inputRef?.current?.focus()} style={{paddingLeft: "3%", height: 45, display: 'flex', flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: addOpacityRGB(color, .5), width: isInputFocused ? "85%" : '100%', ...style}}>
                <IonIcon name={name} size={size} color={color}/>
                <TextInput onBlur={() => setIsInputFocused(false)} onFocus={onPressIn} ref={inputRef} onChangeText={onInputChange} placeholder="Search" style={{ fontSize: 15}}/>
            </Pressable>
            { (isInputFocused || inputRef?.current?.isFocused?.()) &&
            <>
                <Pressable onPress={onCancelPress} style={{ width: 50, paddingLeft: 6 }}>
                    {({pressed}) => (
                            <Text style={{color: opacityOnPressed(pressed, "#909090", 0.7)}}>Cancel</Text>
                    )}
                </Pressable>
            </>
            }
        </View>
    )
}

export { IconSearchBar };