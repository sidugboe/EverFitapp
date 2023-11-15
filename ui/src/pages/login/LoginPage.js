import React, { useState } from "react";
import { View, Text, ScrollView, Image } from 'native-base';
import Logo from "../../../assets/images/Logo.png"
import { StyleSheet, useWindowDimensions } from 'react-native';
import { CustomInput } from "../../components/CustomInput/CustomInput";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../services/authService";

const LoginPage = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showLoading, setShowLoading] = useState(false);
    const { navigation, route} = props

    const {height} = useWindowDimensions();
    const navigation1 = useNavigation();
    const { signIn } = useAuth(undefined, navigation);

    const [showLoginErrorMessage, setShowLoginErrorMessage] = useState(false)

    const showErrorMessage = () => {
        setShowLoginErrorMessage(true)    
        setTimeout(() => setShowLoginErrorMessage(false), 3000) // hide error message after 5 seconds
    }
    
    const onSignInPressed = async () => {
        setShowLoading(true)
        let success = await signIn(username,password)
        
        if(!success)
            showErrorMessage()

        // stop loading
        setShowLoading(false)
    }

    const onForgotPressed = () => {
        // can implement this later 
    }

    const onGooglePressed = () => {
    }

    const onFacebookPressed = () => {
    }

    const onApplePressed = () => {
    }
    const onSignUpPressed = () => {
        navigation1.navigate('Register')
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
        <View style ={styles.root} > 
            <Image source={Logo} 
            style = {[styles.Logo, {height: height * 0.3}]}
            resizeMode ="contain" 
            alt="EverFit"
            />
    
            <CustomInput placeholder= "Username or Email Address" value={username} setValue={setUsername}/>
            <CustomInput  placeholder="Password" value={password} setValue={setPassword} secureTextEntry = {true}/>
            { showLoginErrorMessage && 
                <Text style = {styles.root} color={'red.500'} fontWeight={'bold'}>SORRY INVALID CREDENTIALS</Text>
            }
            <CustomButton text="Sign In" onPress={onSignInPressed} isLoading={showLoading}/>
            <CustomButton text="Forgot Password" onPress={onForgotPressed} type="TERTIARY"/>
            <CustomButton text="Sign In with Google" onPress={onGooglePressed} bgColor="#E7EAF4"fgColor="#4765A9"/>
            <CustomButton text="Sign In with Facebook" onPress={onFacebookPressed} bgColor="#FAE9EA"fgColor="#DD4D44" />
            <CustomButton text="Sign In with Apple" onPress={onApplePressed} bgColor="#e3e3e3"fgColor="#363636"/>
            <CustomButton text="Dont Have an account? Create One" onPress={onSignUpPressed} type="TERTIARY"/>
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
})

export { LoginPage };