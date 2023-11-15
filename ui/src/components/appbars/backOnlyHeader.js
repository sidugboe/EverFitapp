import React, { useState } from 'react'
import { View, Text, Pressable} from 'react-native'
import { PressableButton } from '../generic/PressableButton'
import { default as EvilIcon } from 'react-native-vector-icons/EvilIcons'
import { opacityOnPressed } from '../../utils/helpers/colorHelper'

const BackOnlyHeader = ({ navigation, centerText = "", onBack }) => {

    const onBackPress = () => {
        if(onBack)
            onBack();
        else
            navigation.goBack()
    }

    return (
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: "100%", height: 45, borderBottomColor: 'lightgrey', borderBottomWidth: 1}}>
            <Pressable onPress={onBackPress} hitSlop={5} style={({pressed}) => [{}]}>
                {({pressed, color = "#808080"}) => (
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <EvilIcon name="chevron-left" size={40} color={opacityOnPressed(pressed, color, .7)}/>
                        <Text style={{ color: opacityOnPressed(pressed, color, .7)}}>Back</Text>
                    </View>  
                )}
            </Pressable>
            { centerText &&
                <View style={{ alignItems: 'center', marginLeft: "10%"}}>
                    <Text style={{fontSize: 20}}>{centerText}</Text>
                </View>
            }
        </View>
    )
    
}
export { BackOnlyHeader };