import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginPage } from '../../pages/login/LoginPage';
import { RegisterPage } from '../../pages/Register/RegisterPage';

const SignedOutStack = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="SignedOutStack" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterPage} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default SignedOutStack;