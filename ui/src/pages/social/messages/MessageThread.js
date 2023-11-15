import React, { useState, useEffect } from "react";
import { Center, Button, View, ScrollView, Text, TouchableOpacity} from 'react-native';
import { NewMessageHeader } from "../../../components/appbars/NewMessageHeader";

/**
 * New message screen where user can type to send a (first) message to a user
 * Ater sending message the screen should navigate to the message 
 * @param {*} param0 
 * @returns 
 */
const MessageThread = ({ navigation, route }) => {
    const userName = route?.params?.user?.name  // name of user being messaged
    const userId = route?.params?.user?._id // id of user being messaged

    return (
        <>
            <MessageThreadHeader navigation={navigation} />
            <Text>Message Thread Here</Text>
        </>
    )
}

export { MessageThread };