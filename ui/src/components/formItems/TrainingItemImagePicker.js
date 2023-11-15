import React, { useState } from 'react';
import { View, Text } from "react-native"
import { RoutineCard } from '../../pages/routineList/RoutineCard';
import { WorkoutCard } from '../../pages/workoutList/WorkoutCard';
import { PressableButton } from '../generic/PressableButton';
import { launchImageLibrary } from 'react-native-image-picker';

const TrainingItemImagePicker = ({ image, setImage, type, selectedTextColor, itemName, itemDescription, itemChildren, userName }) => {

    // dummy item to pass to the card component to show the user what the card will look like
    let imageItem = {
        attachments: [image?.uri],
        name: itemName ? itemName : "Routine Name",
        description: itemDescription ? itemDescription : type + " description",
        workoutTemplates: itemChildren ? Array(itemChildren) : [1,2,3],
        textColor: selectedTextColor
    }

    const onChangeImagePress = () => {
        const imagePickerOptions = {
            mediaType: "photo",
            // includeBase64: true
        }

        launchImageLibrary(imagePickerOptions, (response) => {
            if (response) {
                if(response.didCancel)
                    return;

                let img = response.assets?.[0];

                setImage(img)
            }
        });
    }

    const onRemoveImagePress = () => {
        // change state to show confirm button
        setImage(undefined)
    }

    return (
        <View style={{marginTop: 5}}>
            { image ? 
                <>
                    { type === "routine" ?
                        <RoutineCard routine={imageItem}/>
                        :
                        <WorkoutCard workout={imageItem}/>
                    }
                    <PressableButton onPress={onRemoveImagePress} color={"#E8E8E8"} text="Remove Image" fontSize={18} style={{borderRadius: 8, borderWidth: 1, borderColor: "rgb(150,150,150)", marginRight: 15, width: "45%", marginLeft: 20}} opacityOnPress={.8}/>
                </>
                :
                <View style={{ marginLeft: 30, display: 'flex', flexDirection: "row", alignItems: 'center' }}> 
                    <Text style={{ marginRight: 10, paddingBottom: 4}}>No image selected.</Text>
                    <PressableButton onPress={onChangeImagePress} color={"#E8E8E8"} text="Select Image" fontSize={18} style={{borderRadius: 8, borderWidth: 1, borderColor: "rgb(150,150,150)", marginRight: 15, width: "45%"}} opacityOnPress={.8}/>
                </View>
            }
            
        </View>
    )
}

export { TrainingItemImagePicker };