import React, { useState } from 'react'
import { View, Text, Pressable} from 'react-native'
import { PressableButton } from '../generic/PressableButton'
import { default as EvilIcon } from 'react-native-vector-icons/EvilIcons'
import { opacityOnPressed } from '../../utils/helpers/colorHelper'
import { OpacityIcon } from '../generic/OpacityIcon'

const FeedHeader = ({ navigation }) => {

    const onNewPostPress = () => {
        navigation.navigate("CreatePost")
    }

    const onExplorePress = () => {
        navigation.navigate("Explore")
    }

    return (
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: "100%", height: "9%", borderBottomColor: 'lightgrey', borderBottomWidth: 1}}>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: "center", height: "100%"}}>
                <Pressable onPress={onExplorePress} hitSlop={5} style={({pressed}) => [{}]}>
                    {({pressed, color = "#808080"}) => (
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <EvilIcon name="chevron-left" size={40} color={opacityOnPressed(pressed, color, .7)}/>
                            <Text style={{ color: opacityOnPressed(pressed, color, .7)}}>Explore</Text>
                        </View>  
                    )}
                </Pressable>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: "center", marginHorizontal: 12, height: "100%"}}>
                <OpacityIcon name={"pencil-plus"} size={27} onPress={onNewPostPress} />
            </View>
        </View>
    )
    
}
export { FeedHeader };