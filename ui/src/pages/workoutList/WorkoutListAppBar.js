import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, Pressable } from 'react-native';
//import EverFitLogo from 
import * as RootNavigation from '../../components/navigation/RootNavigationRef';
import styles from "../../stylesheet";
import { ThreeDotsIcon, AddIcon, CheckIcon, Button, ArrowBackIcon } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const WorkoutListAppBar = ({ navigation, onEditPress, isEditMode, onBackPress, heading }) => {

    return (
        <View>
            <View style={[{...styles.AppBarContainer}, {backgroundColor: 'white'}]}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Button variant="ghost" onPress={onBackPress} style={{borderRadius: 50}}>
                        <ArrowBackIcon></ArrowBackIcon>
                    </Button>
                    <Text style={{fontSize: 25, color: 'black', height: 35}}>{heading}</Text>
                </View>
                <View style={{marginRight: 10, display: 'flex', flexDirection: 'row'}}>
                    { isEditMode ? 
                        <Button size="10" width="12" height="30" variant="outline" onPress={onEditPress} style={{marginLeft: 10}}>Done</Button>
                        :
                        <>
                        <Button size="25" width="20" height="33" variant="outline" onPress={onEditPress} style={{marginLeft: 10}}>Edit</Button>
                        </>
                    }
                </View>
            </View>
            {/* todo add profile popout */}
        </View>
    );
};

export { WorkoutListAppBar };