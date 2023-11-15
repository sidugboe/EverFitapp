import React, { useState, useEffect, useRef } from "react";
import { View, ScrollView, Text, Image, Pressable} from 'react-native';
import { CustomButton } from "../../components/CustomButton/CustomButton";
import { useAuth } from "../../services/authService";

const SettingsScreen = ({ navigation, route }) => {
    const { signOut } = useAuth();

    return (
        <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', alignItems: 'center'}}>
            <Text style={{fontSize: 30, marginTop: 10}}>Settings</Text>
            <CustomButton text="Sign Out" onPress={() => signOut()}/>
        </View>
    )
}

export { SettingsScreen };