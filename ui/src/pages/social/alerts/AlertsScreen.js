import React, { useState, useEffect } from "react";
import { Center, Button, View, ScrollView, Text} from 'react-native';
import { AlertScreenHeader } from "../../../components/appbars/AlertScreenHeader";

const ALERT_DUMMY_DATA = [
    <Text style={{paddingVertical: 6, fontSize: 18, paddingLeft: 5, borderBottomWidth: 1, borderBottomColor: 'lightgrey'}}>You have one new message from <Text style={{fontWeight: "bold"}}>Cbum</Text></Text>,
    <Text style={{paddingVertical: 6, fontSize: 18, paddingLeft: 5, borderBottomWidth: 1, borderBottomColor: 'lightgrey'}}><Text style={{fontWeight: "bold"}}>Seyon</Text> liked your post</Text>,
    <Text style={{paddingVertical: 6, fontSize: 18, paddingLeft: 5, borderBottomWidth: 1, borderBottomColor: 'lightgrey'}}><Text style={{fontWeight: "bold"}}>Marco</Text> liked your post</Text>,
    <Text style={{paddingVertical: 6, fontSize: 18, paddingLeft: 5, borderBottomWidth: 1, borderBottomColor: 'lightgrey'}}><Text style={{fontWeight: "bold"}}>Matt Liu</Text> followed you</Text>,
    <Text style={{paddingVertical: 6, fontSize: 18, paddingLeft: 5, borderBottomWidth: 1, borderBottomColor: 'lightgrey'}}><Text style={{fontWeight: "bold"}}>TheBiggest</Text> followed you</Text>,
    <Text style={{paddingVertical: 6, fontSize: 18, paddingLeft: 5, borderBottomWidth: 1, borderBottomColor: 'lightgrey'}}>Welcome to EverFit!</Text>,
];

/**
 * Alert screen where user can see recent notifications
 * @param {*} param0 
 * @returns 
 */
const AlertsScreen = ({ navigation, route }) => {

    return (
        <>
            <AlertScreenHeader navigation={navigation} />
            { ALERT_DUMMY_DATA.map((text, index) => {

                return (
                    <Text style={{paddingVertical: 6, fontSize: 18, paddingLeft: 5, borderBottomWidth: 1, borderBottomColor: 'lightgrey'}} key={"alert-screen-" + index}>{text}</Text>
                )
            })

            }
        </>
    )
}

export { AlertsScreen };