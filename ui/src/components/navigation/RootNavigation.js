import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NavigationDecider from './NavigationDecider';
import { navigationRef } from './RootNavigationRef';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { AuthProvider } from '../../services/authService';

const RootNavigation = () => {

    const appTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: 'white'
        },
    };

    return (
        <AuthProvider>
            <NavigationContainer ref={navigationRef} theme={appTheme}>
                <NavigationDecider/>
            </NavigationContainer>
        </AuthProvider>
    )
};

export default RootNavigation;