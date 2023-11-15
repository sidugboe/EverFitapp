import React, { useState } from 'react'
import { View, Text} from 'react-native'
import { PressableButton } from '../generic/PressableButton'
import { ConfirmationModal } from '../modal/ConfirmationModal'

const AlertScreenHeader = ({ navigation }) => {

    const onMessagesPress = () => {
        navigation.navigate("Messages")
    }

    return (
        <View style={{width: "100%", height: "9%", borderBottomColor: 'lightgrey', borderBottomWidth: 1}}>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: "center", marginHorizontal: 12, height: "100%"}}>
                <Text style={{fontSize: 20, marginRight: "35%"}}>Alerts</Text>
                <PressableButton name={"comment"} size={27} onPress={onMessagesPress} color={"grey"} iconType="evilIcon"/>
            </View>
        </View>
    )
    
}
export { AlertScreenHeader }