import React, { useState } from 'react'
import { View, Text} from 'react-native'
import { PressableButton } from '../generic/PressableButton'

const NewMessageHeader = ({ navigation }) => {

    const onMessagesPress = () => {

    }

    return (
        <View style={{width: "100%", height: "9%", borderBottomColor: 'lightgrey', borderBottomWidth: 1}}>
            {/* <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: "center", marginHorizontal: 12, height: "100%"}}>
                <PressableButton name={"add"} size={27} onPress={onMessagesPress} color={"grey"} iconType={"ionIcon"}/>
            </View> */}
        </View>
    )
    
}
export { NewMessageHeader }