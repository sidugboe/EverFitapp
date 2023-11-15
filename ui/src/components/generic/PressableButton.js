import React from "react";
import { Pressable, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { addOpacityRGB } from "../../utils/helpers/colorHelper";
import { opacityOnPressed, pSBC } from "../../utils/helpers/colorHelper";
import { default as EvilIcon } from 'react-native-vector-icons/EvilIcons'
import { default as IonIcon } from 'react-native-vector-icons/Ionicons';
import { default as MaterialIcon } from 'react-native-vector-icons/MaterialIcons';

const PressableButton = ({onPress, name, size = 27, text, color = "#D0D0D0", style, textStyle, opacityOnPress = .7, isDisabledPressable, isDisabled = false, fontSize, children, autoFillColors = false, textColor, iconType, iconColor }) => {

    let bgColor = color;
    let fgColor = textColor ? textColor : iconColor;

    // autofill text color based on provided background color, making text color a darker shade of the background color
    // if no text then the button will have no background color - icon only
    if(autoFillColors && color && text && !textColor){ 
        fgColor = pSBC(-.7, bgColor)
    }
    else if(!iconColor){
        fgColor = "black"
    }

    return (
        <Pressable onPress={onPress} style={({pressed}) => text ? [{backgroundColor: opacityOnPressed(pressed, bgColor ? bgColor : "#E8E8E8", opacityOnPress), borderRadius: 12, marginTop: 10, marginBottom: 15, ...style}] : []}>
            {({pressed}) => {
                
                return ( children ?
                    {...children}
                    :
                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                        { (name && !iconType ) ?    // evil icon by default
                                <Icon name={name} size={size} style={{ padding: 3, paddingTop: 5, color: (pressed && !isDisabled) ? addOpacityRGB(fgColor ? fgColor : "#696969", opacityOnPress) : fgColor ? fgColor : "#696969" }}/>
                            :
                            (name && iconType === "evilIcon") ?
                                <EvilIcon name={name} size={size} style={{ padding: 3, paddingTop: 5, color: (pressed && !isDisabled) ? addOpacityRGB(fgColor ? fgColor : "#696969", opacityOnPress) : fgColor ? fgColor : "#696969" }}/>
                            :
                            (name && iconType === "ionIcon") ?
                                <IonIcon name={name} size={size} style={{ padding: 3, paddingTop: 5, color: (pressed && !isDisabled) ? addOpacityRGB(fgColor ? fgColor : "#696969", opacityOnPress) : fgColor ? fgColor : "#696969" }}/>
                            :
                            (name && iconType === "material") ?
                            <MaterialIcon name={name} size={size} style={{ padding: 3, paddingTop: 5, color: (pressed && !isDisabled) ? addOpacityRGB(fgColor ? fgColor : "#696969", opacityOnPress) : fgColor ? fgColor : "#696969" }}/>
                            :
                            <></>
                        }
                        { text &&
                            <Text style={{color: pressed ? addOpacityRGB(fgColor ? fgColor : "#585858", .7) : fgColor ? fgColor : "#585858", fontSize: fontSize ? fontSize : 20, marginHorizontal: 10, ...textStyle}}>{text}</Text>
                        }
                    </View>
                )
            }}                        
        </Pressable>
    )
}

export { PressableButton }