import React, { useState, useEffect } from "react";
import { Button, View, ScrollView, Text, TouchableOpacity, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomePageHeader = ({}) => {
    return (
        <View style={{width: "100%", backgroundColor: 'lightgreen', height: 30, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{color: "blue"}}>E V E R F I T</Text>
            <Icon name="search" size={25} style={{padding: 3, paddingTop: 5}}/>
        </View>
    )
}

export { HomePageHeader };