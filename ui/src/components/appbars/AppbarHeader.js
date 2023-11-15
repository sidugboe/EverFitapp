import React, { useState } from 'react';
import { View, Box, Image, Center } from 'native-base';
//import EverFitLogo from 
import * as RootNavigation from '../../components/navigation/RootNavigationRef';
import styles from "../../stylesheet";

const AppBarHeader = ({ navigation }) => {

    return (
        <Box >
            <Center borderWidth='0' width='110%' shadow='3' px='16' pt='1' mt='-3' mx='-3'>
                <Image source={require('../../../assets/images/words_only.png')} alt="E V E R F I T" resizeMode="contain"/>
            </Center>
        </Box>
    )
}

export default AppBarHeader