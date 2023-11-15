import React from 'react';
import { useEffect } from 'react';
import SignedInStack from './SignedInStack';
import SignedOutStack from './SignedOutStack';
import { useAuth } from '../../services/authService';


const NavigationDecider  = () => {
    const { userToken, isLoading } = useAuth()

    if(userToken || isLoading){
        return <SignedInStack />;
    }
    else {
        return <SignedOutStack />        
    }

}

export default NavigationDecider