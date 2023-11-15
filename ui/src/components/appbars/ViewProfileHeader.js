import React, { useState } from 'react'
import { View, Text, Pressable} from 'react-native'
import { PressableButton } from '../generic/PressableButton'
import { default as EvilIcon } from 'react-native-vector-icons/EvilIcons'
import { opacityOnPressed } from '../../utils/helpers/colorHelper'

const ViewProfileHeader = ({ navigation, user, isUsersOwnProfile }) => {

    const onMorePress = () => {
        if(isUsersOwnProfile)
            navigation.navigate("Settings")
        
        // else open some other settings modal
    }

    const onBackPress = () => {
        navigation.goBack()
    }

    return (
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',width: "100%", height: 45, borderBottomColor: 'lightgrey', borderBottomWidth: 1}}>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: "center", height: "100%", width: "33%"}}>
                { !isUsersOwnProfile &&
                    <Pressable onPress={onBackPress} hitSlop={5} style={({pressed}) => [{}]}>
                        {({pressed, color = "#808080"}) => (
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <EvilIcon name="chevron-left" size={40} color={opacityOnPressed(pressed, color, .7)}/>
                                <Text style={{ color: opacityOnPressed(pressed, color, .7)}}>Back</Text>
                            </View>  
                        )}
                    </Pressable>
                }
            </View>
            <View style={{width: "33%", alignItems: 'center'}}>
                <Text style={{fontSize: 20}}>{user?.name}</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: "center", width: "33%", height: "100%", paddingRight: 12}}>
                <PressableButton name={"dots-horizontal"} size={27} onPress={onMorePress} color={"grey"}/>
            </View>
        </View>
    )
    
}
export { ViewProfileHeader };