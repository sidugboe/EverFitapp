import React, { useState } from 'react'
import { View, Text} from 'react-native'
import { PressableButton } from '../generic/PressableButton'
import { ConfirmationModal } from '../modal/ConfirmationModal'

const ExplorePageHeader = ({ navigation }) => {

    const onBackPress = () => {
        navigation.goBack();
    }

    return (
        <View style={{ width: "100%", height: 40, marginTop: 5 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: "center", marginHorizontal: 5, height: "100%" }}>
                <PressableButton name={"arrow-forward"} size={27} onPress={onBackPress} iconColor={"rgb(150,150,170)"} iconType="ionIcon"/>
            </View>
        </View>
    )
    
}
export { ExplorePageHeader }