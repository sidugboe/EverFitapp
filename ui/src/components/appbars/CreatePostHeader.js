import React, { useState } from 'react'
import { View, Text} from 'react-native'
import { PressableButton } from '../generic/PressableButton'
import { ConfirmationModal } from '../modal/ConfirmationModal'

const CreatePostHeader = ({ navigation, canSubmitPost, onNext, postItems, postTitle }) => {
    const [isExitWithouSaveModalOpen, setIsExistWIthoutSaveModalOpen] = useState(false)
    const [isCannotProceedModalOpen, setIsCannotProceedModalOpen] = useState(false)

    const onBackPress = () => {
        if(postTitle || postItems?.length !== 1 || postItems[0]?.text){
            setIsExistWIthoutSaveModalOpen(true)
        }
        else {
            navigation.navigate("SocialHomePage")
        }
    }

    return (
        <>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: "space-between", marginRight: 10}}>
                <PressableButton name="close" onPress={onBackPress}/>
                <PressableButton name="" text={"Next"} onPress={canSubmitPost ? onNext : () => setIsCannotProceedModalOpen(true)} textColor={canSubmitPost ? "balck" : 'lightgrey'}/>
            </View>
            <ConfirmationModal isVisible={isExitWithouSaveModalOpen} onClose={() => setIsExistWIthoutSaveModalOpen(false)} onConfirm={() => navigation.navigate("SocialHomePage")} titleText={"Discard post?"} bodyText={"Are you sure you want to discard the current post?"} showCancelButton={true}/>
            <ConfirmationModal isVisible={isCannotProceedModalOpen} confirmButtonText="continue" onClose={() => setIsCannotProceedModalOpen(false)} onConfirm={() => setIsCannotProceedModalOpen(false)} titleText={"Cannot Proceed"} bodyText={"You must enter a post title before proceeding."} showCancelButton={false}/>
        </>
    )
    
}
export { CreatePostHeader };