import React, { useState, useEffect } from "react";
import { Center, Button, View, ScrollView, Text, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const USER_CURRENT_SPLIT_ID = "63eb4bf776d2392ccd011ee9"    // active routine id which is assumed will be stored in user data somewhere
const USER_ID = "user-id-123"   // hard coded userId

const HomeScreenItem = ({ iconName, itemTitle, onPress }) => {

    return (
        <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: "23%", marginHorizontal: 1}}>
            <Pressable onPress={onPress} style={({pressed}) => [{backgroundColor: pressed ? 'rgb(250,250,250)' : '#e6e6e6', borderRadius: 50, height: 52, width: 52, borderColor: '#A8A8A8', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "space-around"}]}>
                {({pressed}) => (
                    <View style={{}}>
                        <Icon name={iconName} size={pressed ? 32 : 35} />
                    </View>
                )}
            </Pressable>
            <Text>{itemTitle}</Text>
        </View>
    );
}

export { HomeScreenItem };

