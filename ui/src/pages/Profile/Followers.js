import React, { useState, useEffect, useRef } from "react";
import { Text, FlatList, View, Image, Pressable } from "react-native";
import { opacityOnPressed, pSBC, backgroundOnPressed } from "../../utils/helpers/colorHelper";
import { BackOnlyHeader } from "../../components/appbars/backOnlyHeader";

const DEFAULT_PROFILE_URL = "https://everfit-images.s3.us-east-2.amazonaws.com/photo.png"

/**
 * List of followers
 * @param {*} param0 
 * @returns 
 */
const Followers = ({ navigation, route }) => {
    const followers = route?.params?.followers;

    const onUserPress = (user) => {
        navigation.navigate("ViewProfile", { userId: user?._id })
    }

    const renderFollower = (item) => {
        let user = item.item, index = item.index

        return (
            <Pressable onPress={() => onUserPress(user)} style={({pressed}) => [{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, backgroundColor: backgroundOnPressed(pressed, "#ffffff")}]}>
                {({pressed}) => (
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{width: 40, height: 40, borderRadius: 40, borderWidth: 0.2, marginHorizontal: 15, overflow: "hidden"}}>
                            <Image source={{ uri: user?.profilePicURL ? user?.profilePicURL : DEFAULT_PROFILE_URL }} style={{ width: 40, height: 40}} />
                        </View>
                        <View style={{display: 'flex', flexDirection: 'column'}}>
                            <Text>{user.username}</Text>
                            <Text>{user.name}</Text>
                        </View>
                    </View>
                )}
            </Pressable>
        )
    }
    
    return (
        <>
        <BackOnlyHeader navigation={navigation}/>
        <FlatList 
            data={followers}
            renderItem={(item) => renderFollower(item)}
            keyExtractor={item => item?._id}
        />
        </>
    )
}

export { Followers };

