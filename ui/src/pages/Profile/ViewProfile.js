import React, { useState, useEffect, useRef } from "react";
import { View, ScrollView, Text, Image, Pressable, FlatList, RefreshControl} from 'react-native';
import { useUserData } from "../../services/userService";
import { ViewProfileHeader } from "../../components/appbars/ViewProfileHeader";
import { PressableButton } from "../../components/generic/PressableButton";
import { ProfileBody } from "./ProfileBody";
import { opacityOnPressed } from "../../utils/helpers/colorHelper";
import { useAuth } from "../../services/authService";

const IMAGE_DIMENSIONS = 80
const DEFAULT_PROFILE_URL = "https://everfit-images.s3.us-east-2.amazonaws.com/photo.png"
const PROFILE_ITEMS = ["posts", "routines", "workouts", "exercises"]

/**
 * View profile screen that renders a user's profile
 * @param {*} param0 
 * @returns 
 */
const ViewProfile = ({ navigation, route }) => {
    const profileBeingViewed = route?.params?.userId

    // get current user's info
    const { user: currentUser } = useAuth();

    // check if the profile we are viewing is this user's
    const isUsersOwnProfile = currentUser?._id === profileBeingViewed || route?.params?.isUsersOwnProfile === true; // true if the user is viewing their own profile

    // fetch user profile and data depending on whether its the current users or some other user provided by nav props
    const { user, isLoading: isLoadingUser, userPosts, userTrainingItems, followUser, unfollowUser, fetchUserData } = useUserData(isUsersOwnProfile ? currentUser?._id : profileBeingViewed);

    // if the page was navigated to with prop { reload: true } then reload the data and re set the reload prop to false
    useEffect(() => {
        if(route?.params?.reload){
            navigation.setParams({profileBeingViewed: profileBeingViewed, reload: false})
            fetchUserData();
        }
    },)

    // component state
    const [selectedItemType, setSelectedItemType] = useState("posts")    // the category of items selected under a users profile
    const [doesUserFollowUser, setDoesUserFollowUser] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const scrollBar = useRef(0)

    // updates following when user and current user objects are fetched
    useEffect(() => {
        if(currentUser && user)
            setDoesUserFollowUser(currentUser?.following?.filter(followingUser => followingUser._id === user?._id).length !== 0)
    }, [currentUser, user])
    
    const onItemTypePress = (item, index) => {
        setSelectedItemType(item)

        // scroll scrollview to show item fully
        if(index === PROFILE_ITEMS.length - 1)
            scrollBar?.current?.scrollToEnd()
        else if(index === 0){
            scrollBar?.current?.scrollTo({x: 0})
        }
    }

    // todo fix issues between these methods and setDoesUserFollowUser useEffect so following/followers are updated properly
    const onUnfollow = async () => {
        let res = await unfollowUser(user?._id)
        setDoesUserFollowUser(false)
    }

    // todo fix issues between these methods and setDoesUserFollowUser useEffect so following/followers are updated properly
    const onFollow = async () => {
        let res = await followUser(user?._id)
        setDoesUserFollowUser(true)
    }

    return (
        <View style={{display: 'flex', flexDirection: 'column', width: '100%', flex: 1}}>
            <ViewProfileHeader navigation={navigation} user={user} isUsersOwnProfile={route?.params?.isUsersOwnProfile}/>
            { (!isLoadingUser && !Object.keys(user).length) &&
                <View style={{width: '100%', backgroundColor: "#ff4d4d", height: 25, display: 'flex', flexDirection: 'row', alignItems: 'center', paddingLeft: 10}}>
                    <Text>User not found.</Text>
                </View>
            }
            <View>
                <ScrollView  
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={() => setTimeout(() => setIsRefreshing(false), 1000)} />
                    } 
                    style={{ backgroundColor: '#92B5EC', display: 'flex', flexDirection: 'column', paddingLeft: 20}}>
                        <HeaderInfo user={user} numOfPosts={userPosts?.length} navigation={navigation}/>
                        <HeaderControls user={user} navigation={navigation} isUsersOwnProfile={isUsersOwnProfile} doesUserFollowUser={doesUserFollowUser} onFollow={onFollow} onUnfollow={onUnfollow}/>
                </ScrollView>
            </View>

            {/* User items */}
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', borderBottomWidth: 1, borderBottomColor: 'grey', paddingBottom: 5, paddingTop: 5}}>
                <ScrollView ref={scrollBar} horizontal={true} showsHorizontalScrollIndicator={false} style={{height: "100%"}} contentContainerStyle={{}}>
                    { PROFILE_ITEMS.map((item, index) => {

                        return (
                            <Pressable onPress={() => onItemTypePress(item, index)} style={{ height: '100%', width: 100, display: 'flex', flexDirection: "row", justifyContent: 'space-around', alignItems: "center"}} key={"profile-item-" + index}>
                                {({pressed}) => (
                                    <View>
                                        <Text style={{fontWeight: selectedItemType === item ? "bold" : "normal"}}>{item[0].toUpperCase() + item.substring(1)}</Text>
                                    </View>
                                )}
                            </Pressable>
                        )
                    })}
                </ScrollView>
            </View>

            <ProfileBody selectedType={selectedItemType} navigation={navigation} userPosts={userPosts} userRoutines={userTrainingItems?.routines} userWorkouts={userTrainingItems?.workouts} userExercises={userTrainingItems?.exercises} isOwnProfile={isUsersOwnProfile}/>
        </View>
    )
}

const HeaderInfo = ({ user, navigation, numOfPosts }) => {

    const onFollowingPress = () => {
        navigation.navigate("Following", { following: user?.following})
    }

    const onFollowersPress = () => {
        navigation.navigate("Followers", { followers: user?.followers})
    }

    return (
        <View>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: "flex-start", marginTop: "5%", /*backgroundColor: 'lightblue'*/}}>
                <View style={{height: IMAGE_DIMENSIONS, width: IMAGE_DIMENSIONS, borderRadius: 200, borderColor: 'grey', borderWidth: 1, overflow: 'hidden'}}>
                    <Image source={{ uri: user?.profilePicURL ? user?.profilePicURL : DEFAULT_PROFILE_URL }} style={{ width: IMAGE_DIMENSIONS, height: IMAGE_DIMENSIONS}} />
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-around", marginTop: 10, /*backgroundColor: 'lightgreen',*/ width: '70%'}}>
                    <Pressable style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {({pressed, color="#202020"}) => (
                            <>
                                <Text style={{fontSize: 18, color: color }}>{numOfPosts ? numOfPosts : 0}</Text>
                                <Text style={{fontSize: 15, color: color }}>  Posts  </Text>
                            </>
                        )}
                    </Pressable>
                    <Pressable onPress={onFollowersPress} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {({pressed, color="#202020"}) => (
                            <>
                                <Text style={{fontSize: 18, color: opacityOnPressed(pressed, color, .6)}}>{user?.followers ? user.followers.length : 0}</Text>
                                <Text style={{fontSize: 15, color: opacityOnPressed(pressed, color, .6)}}>Followers</Text>
                            </>
                        )}
                    </Pressable>
                    <Pressable onPress={onFollowingPress} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {({pressed, color="#202020"}) => (
                            <>
                                <Text style={{fontSize: 18, color: opacityOnPressed(pressed, color, .6)}}>{user?.following ? user.following.length : 0}</Text>
                                <Text style={{fontSize: 15, color: opacityOnPressed(pressed, color, .6)}}>Following</Text>
                            </>
                        )}
                    </Pressable>
                </View>
            </View>
            <View style={{width: "80%", marginTop: 5, display: 'flex', flexDirection: 'column'}}>
                <Text style={{fontSize: 16, color: "#202020"}}>{user.biography}</Text>
            </View>
        </View>
    )
}

const HeaderControls = ({ user, navigation, isUsersOwnProfile, doesUserFollowUser, onUnfollow, onFollow }) => {

    const onMessagePress = () => {
        // navigate to message thread if one exists else navigate to new message thread
        navigation.navigate("NewMessage")   // unless message and newMessage screen are two different 
    }

    const onEditProfilePress = () => {
        navigation.navigate("EditProfile");
    }

    return (
        <View style={{ display: 'flex', flexDirection: 'row'}}>
            { isUsersOwnProfile ? 
                <>
                <PressableButton onPress={onEditProfilePress} color={"#ffffff"} text="Edit Profile" fontSize={18} style={{borderRadius: 8, borderWidth: 1, borderColor: "rgb(150,150,150)", marginRight: 15, width: "35%"}} opacityOnPress={.8}/>
                {/* <PressableButton onPress={} color={"#ffffff"} text="message" fontSize={18} style={{borderRadius: 8, borderWidth: 1, borderColor: "rgb(150,150,150)", marginRight: 15, width: "35%"}} opacityOnPress={.8}/> */}
            </>
            :
                <>
                    <PressableButton onPress={doesUserFollowUser ? onUnfollow : onFollow} color={"#ffffff"} text={doesUserFollowUser ? "Unfollow" : "Follow"} fontSize={18} style={{borderRadius: 8, borderWidth: 1, borderColor: "rgb(150,150,150)", marginRight: 15, width: "35%"}} opacityOnPress={.8}/>
                    <PressableButton onPress={onMessagePress} color={"#ffffff"} text="Message" fontSize={18} style={{borderRadius: 8, borderWidth: 1, borderColor: "rgb(150,150,150)", marginRight: 15, width: "35%"}} opacityOnPress={.8}/>
                </>
            }
        </View>
    )
}

export { ViewProfile };