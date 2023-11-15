import React, { useState, useEffect } from "react";
import { View } from 'react-native';
import { Feed } from "./Feed";
import { PressableButton } from "../../components/generic/PressableButton";
import { ConfirmationModal } from "../../components/modal/ConfirmationModal";
import { FeedHeader } from "../../components/appbars/FeedHeader";

const SocialHomePage = ({ navigation, route}) => {
    const comingFromPostSubmit = Object.hasOwn(route?.params, "success")   // if the route props have "sucess" property then we are coming from submit post and need to show message
    const [showMessageModal, setShowMessageModal] = useState(comingFromPostSubmit);

    return (
        <>
            <FeedHeader navigation={navigation}/>
            <Feed navigation={navigation}/>
            <ConfirmationModal isVisible={showMessageModal} onConfirm={() => setShowMessageModal} onClose={() => setShowMessageModal} showCancelButton={false} confirmButtonText={"ok"} titleText={route?.params?.success ? "Success" : "Something went wrong"} bodyText={route?.params?.message}/>
        </>
    )
}

export { SocialHomePage };