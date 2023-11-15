import React, { useRef, useState, useEffect } from "react";
import { View, Text, ScrollView, Box, VStack, Divider, HStack, AspectRatio, Image, Center, Stack, Heading, Pressable } from 'native-base';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { CustomInput } from "../../components/CustomInput/CustomInput";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import { SocialSignInButton } from "../../components/SocialSignInButton/SocialSignInButton";
import { useNavigation } from "@react-navigation/native";
import { AuthProvider, useAuth } from "../../services/authService";

const RegisterPage = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const {signUp} = useAuth();
    const navigation = useNavigation();
    const [showPasswordErrorMessage, setShowPasswordErrorMessage] = useState(false)
    const [showMissingError, setShowMissingError] = useState(false)

    const onRegisterPressed = () => {
        if(!name||!username||!email|| !password|| !passwordRepeat){
            setShowMissingError(true)    
            setTimeout(() => setShowMissingError(false), 5000)

        }else if(password !== passwordRepeat){
            setShowPasswordErrorMessage(true)    
            setTimeout(() => setShowPasswordErrorMessage(false), 5000) // hide error message after 5 seconds
        
        }else
        signUp(name,username,email,password);
        
    }
    const onSignInPressed = () => {
        navigation.navigate('Login')
    }

    const {height} = useWindowDimensions();
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
        <View style ={styles.root} > 
            <Text style = {styles.title}>Create an Account</Text>
            <CustomInput placeholder= "Name (Ex. John Doe)" value={name} setValue={setName} />
            <CustomInput placeholder= "Username" value={username} setValue={setUsername} />
            <CustomInput placeholder= "Email" value={email} setValue={setEmail} />
            <CustomInput  placeholder="Password" value={password} setValue={setPassword} secureTextEntry = {true}/>
            <CustomInput placeholder= "Confirm Password" value={passwordRepeat} setValue={setPasswordRepeat} secureTextEntry />
            {showPasswordErrorMessage && 
            <Text style = {styles.root} color={'red.500'} fontWeight={'bold'}>SORRY PASSWORDS DO NOT MATCH</Text>
             }
             {showMissingError && 
            <Text style = {styles.root} color={'red.500'} fontWeight={'bold'}>MISSING FIELDS</Text>
             }
            <CustomButton text="Register" onPress={onRegisterPressed}/>
            <CustomButton text="Have an account? Sign In" onPress={onSignInPressed} type="TERTIARY"/> 
        </View>
        </ScrollView>

    )
} 

const styles = StyleSheet.create({
    root:{
        alignItems: 'center',
        padding: 20,
    },
    Logo:{
        width: '70%',
        maxWidth: 300,
        maxHeight: 150,
    },
    title:{
        fontSize: 24, 
        fontWeight: 'bold',
        color: '#051C60', 
        margin: 10, 
        padding: 20
    }, 
})

export { RegisterPage };