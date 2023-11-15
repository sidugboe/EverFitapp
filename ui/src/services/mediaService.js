import React, { useContext, useState, useEffect, useRef } from "react";
import { Platform } from "react-native";
import { useAuth } from "./authService";

const USE_LOCAL_DATA = false;

const useMedia = () => {
    const { userToken, user, isLoading: isLoadingAuth } = useAuth();

    const uploadImage = async (image) => {

        // GET uri for image upload
        let { url } = await fetch('http://3.138.86.29/upload',{
                headers: { 
                    'Authorization': "Bearer " + userToken
                },
            })
            .then((response) => response.json())
        
        // format the image object for upload (as per https://stackoverflow.com/questions/45914024/react-native-upload-image-as-a-file)
        var photo = {
            uri: image.uri,
            type: 'image/jpeg',
            name: image.fileName,
        };

        let response = await fetch(url, {
                method:'PUT',
                headers: { 
                    "Content-Type": "multipart/form-data",
                },
                body: photo,
            })
            //.then(res => res.json())// can't get response properly with .json() so leaving it out

        // return the url so the url of the image can be saved
        return url
    }

    return {
        uploadImage,
    }
}

export { useMedia };