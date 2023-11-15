import React, { useState, useEffect } from "react";
import { Center, Button, View, ScrollView, Text, TouchableOpacity} from 'react-native';
import { MessageListHeader } from "../../../components/appbars/MessageListHeader";
/**
 * Message List screen where user can see all of their message threads
 * @param {*} param0 
 * @returns 
 */
const MessageList = ({ navigation, route }) => {

    return (
        <>
            <MessageListHeader navigation={navigation} />
            <Text>Messages List Here</Text>
        </>
    )
}

export { MessageList };