import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { ConfirmationModal } from '../modal/ConfirmationModal';
import { PressableButton } from '../generic/PressableButton';

const SubmitPostHeader = ({ navigation, onSubmit, canSubmit }) => {
    const [isSubmitPostModalOpen, setIsSubmitPostModalOpen] = useState(false)
    const [isCannotSubmitModalopen, setIsCannotSubmitModalOpen] = useState(false)

    const onConfirm = () => {
        setIsSubmitPostModalOpen(false);
        onSubmit();
    }

    const onPostPress = () => {
        if(canSubmit){
            setIsSubmitPostModalOpen(true)
        }
        else {
            setIsCannotSubmitModalOpen(true)
        }
    }

    return (
        <>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: 'center',marginRight: 10}}>
                <PressableButton name="chevron-left" onPress={() => navigation.navigate("CreatePost")}/>
                <Text style={{fontSize: 20, color: 'black'}}> Select Post Subjects</Text>
                <PressableButton name="" text={"Post"} onPress={onPostPress} />
            </View>
            <ConfirmationModal isVisible={isSubmitPostModalOpen} onClose={() => setIsSubmitPostModalOpen(false)} onConfirm={onConfirm} titleText={"Confirm Post?"} bodyText={"Press continue to confirm"} showCancelButton={true}/>
            <ConfirmationModal isVisible={isCannotSubmitModalopen} onClose={() => setIsCannotSubmitModalOpen(false)} onConfirm={() => setIsCannotSubmitModalOpen(false)} titleText={"Cannot submit"} bodyText={"You must select at least one topic tag to create this post"} showCancelButton={false} confirmButtonText="continue"/>
        </>
    )
    
}

export { SubmitPostHeader };