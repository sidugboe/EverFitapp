import React from "react";
import { Pressable } from 'react-native';
import { Icon } from "./Icon";
import { addOpacityRGB, opacityOnPressed } from "../../utils/helpers/colorHelper";

const OpacityIcon = ({onPress, name, size, color = "#505050", style, opacityOnPress = .7, isDisabledPressable, isDisabled = false, iconType = "materialCommunity"}) => {

    return (
        <Pressable onPress={onPress} style={({pressed}) => [{}]}>
            {({pressed}) => {
                let iconColor = opacityOnPressed(pressed, color, opacityOnPress)

                return (
                    <Icon type={iconType} name={name} size={size} style={{padding: 3, paddingTop: 5, color: iconColor}}/>
                )
            }}                        
        </Pressable>
    )
}

export { OpacityIcon }