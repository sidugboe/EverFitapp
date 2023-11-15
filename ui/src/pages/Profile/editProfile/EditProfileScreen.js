import React, { useState, useEffect } from "react";
import { Center, Button, View, ScrollView, Text, Pressable, TextInput, Image} from 'react-native';
import { BackOnlyHeader } from "../../../components/appbars/backOnlyHeader";
import { PressableButton } from "../../../components/generic/PressableButton";
import { launchImageLibrary } from 'react-native-image-picker';
import { useMedia } from "../../../services/mediaService";
import { useProfile } from "../../../services/profileService";
import { useToast } from "native-base";
import { useAuth } from "../../../services/authService";
import { ConfirmationModal } from '../../../components/modal/ConfirmationModal';

let IMAGE_DIMENSIONS = 80.0

const EditProfileScreen = ({ navigation, route }) => {

    // component state
    const [image, setImage] = useState();
    const [hasImageChanged, setHasImageChanged] = useState(false);
    const [imageScaleDown, setImageScaleDown] = useState(0);
    const [userProfile, setUserProfile] = useState(0)
    const [isRemoveImageEnabled, setIsRemoveImageEnabled] = useState(false)
    const [isConfirmVisibilityModalOpen, setIsConfirmVisibilityModalOpen] = useState(false);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [updatedBio, setUpdatedBio] = useState("")

    // attempting to scale profile image height/width properly
    // useEffect(() => {
    //     if(image?.height && image?.width)
    //         setImageScaleDown(image?.height > image?.width ? IMAGE_DIMENSIONS/image?.height : IMAGE_DIMENSIONS/image?.width)
    // }, [image])

    // data hooks
    const toast = useToast()
    const { uploadImage } = useMedia();
    const { changeUserProfileImage, changeUserProfileVisibility, getUserProfile, changeUserBio } = useProfile();
    const { userToken, isLoading: isLoadingAuth, user: currentUser } = useAuth();

    useEffect(() => {
        if(!isLoadingAuth && userToken)
            fetchUserProfile();
    }, [isLoadingAuth])

    const fetchUserProfile = async () => {
        let profile = await getUserProfile();
        setUserProfile(profile)
        setImage({ uri: profile.profilePicURL})
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
                setHasImageChanged(true)
            }
        });
    }

    const onUploadImagePress = async () => {
        // upload the image
        let uploadUrl = await uploadImage(image);

        // remove tinformaiton from end of image url
        let profilePicUrl = uploadUrl.split("?")[0]

        // update the user's profile url to the new image url
        await changeUserProfileImage(profilePicUrl);

        // show toast success
        toast.show({
            description: "Image Successfuly Changed",
            duration: 2000
        })

        // refetch user profile to update the photo
        await fetchUserProfile();

        // set image changed to false to the (now changed) profile photo will be shown
        setHasImageChanged(false);
    }

    const onCancelImageChanges = () => {
        setImage({ uri: userProfile.profilePicURL })
        setHasImageChanged(false)
    }

    const onRemoveImagePress = () => {
        // change state to show confirm button
        setIsRemoveImageEnabled(true)
    }

    const removeProfileimage = async () => {
        // set user profile pic url to nothing
        await changeUserProfileImage("");

        // refetch user profile to update the photo
        await fetchUserProfile();

        // show toast success
        toast.show({
            description: "Image Successfuly Removed",
            duration: 2000
        })

        setIsRemoveImageEnabled(false)
    }

    const onToggleVisibilityPress = async () => {
        // close modal
        setIsConfirmVisibilityModalOpen(false)

        let newVisibility = userProfile.visibility === "public" ? "private" : "public"

        // update visibility
        await changeUserProfileVisibility(newVisibility)

        // refetch user profile to update the photo
        await fetchUserProfile();

        // show toast success
        toast.show({
            description: "Profile Visibility Updated",
            duration: 2000
        })
    }

    const onBioChange = (text) => {
        setUpdatedBio(text)
    }

    const onBioSave = async  () => {
        // update visibility
        await changeUserBio(updatedBio)

        // refetch user profile to update the bio
        await fetchUserProfile();

        setIsEditingBio(false);
        setUpdatedBio("")

        // show toast success
        toast.show({
            description: "Profile Bio Updated",
            duration: 2000
        })
    }

    const onCancelBioChangePress = () => {
        setUpdatedBio("")
        setIsEditingBio(false)
    }

    return (
        <View style={{display: 'flex', flexDirection: 'column'}}>
            <BackOnlyHeader navigation={navigation} onBack={() => navigation.navigate("UserProfile", { reload: true })}/>
            <ConfirmationModal isVisible={isConfirmVisibilityModalOpen} onClose={() => setIsConfirmVisibilityModalOpen(false)} onConfirm={onToggleVisibilityPress} showCancelButton={true} titleText={"Change Profile Visibility?"} bodyText={userProfile.visibility == "public" ? "Users who don't follow you will no longer be able to view your profile." : "User's who don't follow you will be able to view your profile view your profile."}/>
            <View style={{display: 'flex', flexDirection: 'column', marginLeft: 20, marginTop: 10}}>
                <Text style={{fontSize: 20}}>Profile Image</Text>
                <View style={{display: 'flex', flexDirection: 'row', marginTop: 10}}>
                    <View style={{ height: IMAGE_DIMENSIONS, width: IMAGE_DIMENSIONS, borderRadius: 200, borderWidth: 0.2, marginRight: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-around', overflow: 'hidden' }}>
                        <Image source={{ uri: (image && image.uri) ? image.uri : undefined }} style={{ width: IMAGE_DIMENSIONS, height: IMAGE_DIMENSIONS}} />
                    </View>
                    <View style={{display: 'flex', flexDirection: 'column', width: "100%", paddingTop: 5}}>
                        { isRemoveImageEnabled ? 
                            <>
                            <PressableButton onPress={removeProfileimage} color={"#89CFF0"} text="Confirm" fontSize={18} style={{borderRadius: 8, borderWidth: 1, borderColor: "rgb(150,150,150)", marginRight: 15, width: "45%", marginTop: 2}} opacityOnPress={.8}/>
                            <PressableButton onPress={() => setIsRemoveImageEnabled(false)} color={"#E8E8E8"} text="Cancel" fontSize={18} style={{borderRadius: 8, borderWidth: 1, borderColor: "rgb(150,150,150)", marginRight: 15, width: "45%", marginTop: 2}} opacityOnPress={.8}/>
                            </>
                            :
                            <>
                                { hasImageChanged ? 
                                    <>
                                        <PressableButton onPress={onUploadImagePress} color={"#89CFF0"} text="Apply Changes" fontSize={18} style={{borderRadius: 8, borderWidth: 1, borderColor: "rgb(150,150,150)", marginRight: 15, width: "45%", marginTop: 2}} opacityOnPress={.8}/>
                                        <PressableButton onPress={onCancelImageChanges} color={"#E8E8E8"} text="Cancel" fontSize={18} style={{borderRadius: 8, borderWidth: 1, borderColor: "rgb(150,150,150)", marginRight: 15, width: "45%", marginTop: 2}} opacityOnPress={.8}/>
                                    </>
                                    :
                                    <>
                                        <PressableButton onPress={onChangeImagePress} color={"#E8E8E8"} text="Change Image" fontSize={18} style={{borderRadius: 8, borderWidth: 1, borderColor: "rgb(150,150,150)", marginRight: 15, width: "45%", marginTop: 2}} opacityOnPress={.8}/>
                                        <PressableButton onPress={onRemoveImagePress} color={"#E8E8E8"} text="Remove Image" fontSize={18} style={{borderRadius: 8, borderWidth: 1, borderColor: "rgb(150,150,150)", marginRight: 15, width: "45%", marginTop: 2}} opacityOnPress={.8}/>
                                    </>
                                }
                            </>
                        }
                    </View>
                </View>
                <Text style={{fontSize: 20, marginBottom: 5, marginTop: 10}}>Biography</Text>
                { isEditingBio ?
                    <TextInput onChangeText={onBioChange} autoFocus={true} textAlignVertical="top" style={{backgroundColor: '#F0F0F0', borderRadius: 15, width: "90%", height: "15%", paddingTop: 10}}></TextInput>
                    :
                    <Text style={{backgroundColor: '#F0F0F0', borderRadius: 15, width: "90%", padding: 7, height: "15%"}}>{userProfile.biography ? userProfile.biography : "No bio."}</Text>
                }
                { isEditingBio ?
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                        { updatedBio &&
                            <PressableButton onPress={onBioSave} color={"#E8E8E8"} text={"Save"} fontSize={18} style={{borderRadius: 8, borderWidth: 1, borderColor: "rgb(150,150,150)", marginRight: 15, width: "35%", marginTop: 10, marginBottom: 0}} opacityOnPress={.8}/>
                        }
                        <PressableButton onPress={onCancelBioChangePress} color={"#E8E8E8"} text={"Cancel"} fontSize={18} style={{borderRadius: 8, borderWidth: 1, borderColor: "rgb(150,150,150)", marginRight: 15, width: "35%", marginTop: 10, marginBottom: 0}} opacityOnPress={.8}/>
                    </View>
                    :
                    <PressableButton onPress={() => setIsEditingBio(true)} color={"#E8E8E8"} text={"Edit"} fontSize={18} style={{borderRadius: 8, borderWidth: 1, borderColor: "rgb(150,150,150)", marginRight: 15, width: "23%", marginTop: 10, marginBottom: 0}} opacityOnPress={.8}/>
                }
                <Text style={{fontSize: 20, marginBottom: 5, marginTop: 15}}>Profile Visibility</Text>
                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{fontSize: 15, marginRight: 10}}>{ userProfile.visibility === "public" ? "Public" : "Private"}</Text>
                            <PressableButton onPress={() => setIsConfirmVisibilityModalOpen(true)} color={"#E8E8E8"} text={userProfile.visibility === "public" ? "Change to Private" : "Change to Public"} fontSize={18} style={{borderRadius: 8, borderWidth: 1, borderColor: "rgb(150,150,150)", marginRight: 15, width: "55%", marginTop: 2, marginBottom: 0}} opacityOnPress={.8}/>
                        </View>
                <Text style={{fontSize: 20, marginBottom: 5, marginTop: 15}}>Personal Measurements</Text>
                { userProfile?.units && 
                    <Text>Units: {userProfile?.units}</Text>
                }
                { userProfile?.weight && 
                    <Text>weight: {userProfile?.weight}</Text>
                }
                { userProfile?.height && 
                    <Text>height: {userProfile?.height}</Text>
                }
                { userProfile?.activeRoutine?.name && 
                    <Text>current routine: {userProfile?.activeRoutine?.name}</Text>
                }
            </View>
        </View>
    )
}

export { EditProfileScreen };