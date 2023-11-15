import React, { useContext, useState, useEffect, useRef } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const authToken = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2aXNpYmlsaXR5IjoicHVibGljIiwiZm9sbG93aW5nIjpbXSwiZm9sbG93ZXJzIjpbXSwiX2lkIjoiNjNkMWRhMzZkNDc5MmZjNWM1MjA0NWNmIiwibmFtZSI6IkRldiBVc2VyIiwidXNlcm5hbWUiOiJkZXZ1c2VyIiwiZW1haWwiOiJ0ZXN0QGFiYy5jb20iLCJfX3YiOjAsImlhdCI6MTY3NTY5NzY2NCwiZXhwIjoxNzA3MjMzNjY0fQ.-exPi9SiPt3UlBJMasEunMrnJeyfxi-VvUqd3pY87vY"
const USE_LOCAL_DATA = true;

const useAsyncStorage = () => {

    const getAyncStorageItem = async (key) => {
        try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return value
        }
        } catch (error) {
            // Error retrieving data
        }
    }

    const setAsyncStorageItem = async (key, value) => {
        try {
            await AsyncStorage.setItem(
                key,
                value
            );
        } catch (error) {
            // Error saving data
            return false;
        }
        
        return true;
    }

    const removeAsyncStorageItem = async (key) =>{
        try {
            await AsyncStorage.removeItem(
                key,
            );
        } catch (error){
            // throw error
            return false;
        }
        
        return true; 
    }

    return {
        getAyncStorageItem,
        setAsyncStorageItem,
        removeAsyncStorageItem,
    }
}

export { useAsyncStorage };