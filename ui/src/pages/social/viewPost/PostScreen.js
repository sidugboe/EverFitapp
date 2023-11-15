import React, { useState, useEffect } from "react";
import { Center, Button, View, ScrollView, Text, Pressable, TextInput, FlatList} from 'react-native';
import { PostHeader } from "../../../components/social/PostHeader";
import { default as MaterialIcon } from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PostCommentSection } from "../../../components/social/PostCommentSection";
import { EmbeddedRoutine } from "../createPost/embeddedItems/EmbeddedRoutine";
import { EmbeddedItemGroup } from "../createPost/embeddedItems/EmbeddedItemGroup";
import { EmbeddedExercise } from "../createPost/embeddedItems/EmbeddedExercise";
import { EmbeddedWorkout } from "../createPost/embeddedItems/EmbeddedWorkout";
import { usePosts } from "../../../services/postService";
import { ExplorePageSkeleton } from "../../../components/skeletons/ExplorePageSkeleton";
import { useAuth } from "../../../services/authService";
import { useUserFunctions } from "../../../services/userServiceFunctions";
import { PostText } from "../createPost/embeddedItems/PostText";

const PostScreen = ({ navigation, route}) => {
    const postId = route?.params?.postId

    // component state
    const [post, setpost] = useState();
    const [hasUserLiked, setHasUserLiked] = useState(false);
    const [hasUserDisliked, setHasUserDisliked] = useState(false);
    const [didUserSavePost, setDidUserSavePost] = useState(false);
    const [itemCreators, setItemCreators] = useState({})

    // data hooks
    const { user } = useAuth();
    const { getPostById, likePost, dislikePost, resetLikeState } = usePosts();
    const { fetchItemCreators } = useUserFunctions();

    useEffect(() => {
        if(postId){
            refectPostData();
        }
    }, [postId])

    const refectPostData = async () => {
        let post = await getPostById(postId);

        if(post){
            setpost(post)
            
            // update likes
            setHasUserDisliked(post.dislikes?.filter(likeUser => likeUser._id === user._id).length > 0)
            setHasUserLiked(post.likes?.filter(likeUser => likeUser._id === user._id).length > 0)
        }

        // fetch item creators so they can be displayed in embedded objects
        let fetchCreatorsFor = [];
        for(let item of post?.items){
            if(item.type === "routine"){
                fetchCreatorsFor = [...fetchCreatorsFor, ...item.routines]
            }
            else if(item.type === "workout"){
                fetchCreatorsFor = [...fetchCreatorsFor, ...item.workoutTemplates]
            }
            else if(item.type === "exercise"){
                fetchCreatorsFor = [...fetchCreatorsFor, ...item.exerciseTemplates]
            }
        }
        let itemToCreatorMap = await fetchItemCreators(fetchCreatorsFor, user)
        setItemCreators(itemToCreatorMap)
    }

    const onLikePress = async () => {
        let isLiking = !hasUserLiked
        let res;

        // update state
        setHasUserLiked(prev => !prev)
        setHasUserDisliked(false)

        // send like/unlike request
        if(isLiking){
            res = await likePost(post._id)
        }
        else {
            res = await resetLikeState(post._id)
        }

        refectPostData();
    }

    const onDislikePress = async () => {
        let isDisliking = !hasUserDisliked

        // update state
        setHasUserDisliked(prev => !prev)
        setHasUserLiked(false)

        // send dislike/undislike request
        if(isDisliking){
            res = await dislikePost(post._id)
        }
        else {
            res = await resetLikeState(post._id)
        }
        
        refectPostData();
    }

    const onSavePress = () => {
        setDidUserSavePost(prev => !prev)
    }

    const onSharePress = () => {
        alert("not implemented")
    }

    const onCommentPress = () => {

    }

    const renderPostItem = (item, index) => {

        // get the index of the most recent text so it can be rendered with a larger height
        let indexOfMostRecentText = 0;
        post.items.forEach((item, index) => item.type === "text" ? indexOfMostRecentText = index : null)
        
        if(item.type === "text"){
            return (
                <View>
                    <PostText value={post.items[index].text} navigation={navigation}/>
                </View>
            )
        }
        else if(item.type === "routine"){
            // if more than one routine (in group) then render multi card
            if(item.routines?.length > 1){
                return (
                    <EmbeddedItemGroup itemType={"routine"} itemCreators={itemCreators} items={item.routines} onDelete={() => onItemDelete(index)}/>
                )
            }
            // else return single routine card
            return (
                <EmbeddedRoutine item={item.routines[0]} creator={itemCreators[item.routines[0]._id]} onDelete={() => onItemDelete(index)}/> // note itemCreators[item.routines[0]._id] and not itemCreators[item._id] because we want the creator of the routine itself not the post item
            )
        }
        else if(item.type === "workout"){

            // if more than one workout (in group) then render multi card
            if(item.workoutTemplates?.length > 1){
                return (
                    <EmbeddedItemGroup itemType={"workout"} itemCreators={itemCreators} items={item.workoutTemplates} onDelete={() => onItemDelete(index)}/>
                )
            }

            // else render single workout card
            return (
                <EmbeddedWorkout item={item.workoutTemplates[0]} onDelete={() => onItemDelete(index)} creator={itemCreators[item.workoutTemplates[0]]}/>
            )
        }
        else if(item.type === "exercise"){
            // if more than one exercise (in group) then render multi card
            if(item.exerciseTemplates?.length > 1){
                return (
                    <EmbeddedItemGroup itemType={"exercise"} itemCreators={itemCreators} items={item.exerciseTemplates} onDelete={() => onItemDelete(index)}/>
                )
            }
            return (
                <EmbeddedExercise item={item.exerciseTemplates[0]} creator={itemCreators[item.exerciseTemplates[0]]} onDelete={() => onItemDelete(index)}/>
            )
        }
        else
            return <></>
    }

    return (
        <ScrollView style={{margin: 10}}>
            { post ?
                <>
                    <PostHeader post={post} navigation={navigation}/>
                    <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: "100%", marginBottom: 10}}>
                            <Text style={{fontSize: 20, fontWeight: "bold"}}>{post?.title}</Text>
                        </View>
                        <ScrollView style={{ marginBottom: 5, width: '100%'}}>
                            <View style={{backgroundColor: '#ffffff', borderRadius: 10, marginBottom: 10}}>
                                { post.items?.map((item, index) => {

                                    return (
                                        <React.Fragment key={"item-" + index}>
                                            {renderPostItem(item, index)}
                                        </React.Fragment>
                                    )
                                })}
                            </View>
                        </ScrollView>
                        <View style={{display: 'flex', flexDirection: 'row', borderTopWidth: 1, borderTopColor: "lightgrey", width: "120%", paddingHorizontal: "10%", marginTop: 10, padding: 5}}>
                            <View style={{display: 'flex', flexDirection: 'row', width: "100%", paddingHorizontal: 15,justifyContent: "space-between", borderBottomColor: "lightgrey", borderBottomWidth: 1, paddingBottom: 6, alignItems: 'center'}}>
                                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                    <Pressable onPress={onLikePress}>
                                        <Icon name={hasUserLiked ? "thumb-up" :"thumb-up-outline"} size={25} style={{padding: 3, paddingTop: 5}}/>
                                    </Pressable>
                                    <Text style={{}}>
                                        {post?.likeCount}
                                    </Text>
                                </View>
                                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                    <Pressable onPress={onDislikePress}>
                                        <Icon name={hasUserDisliked ? "thumb-down" : "thumb-down-outline"} size={25} style={{padding: 3, paddingTop: 5}}/>
                                    </Pressable>
                                    <Text>
                                        {post?.dislikeCount}
                                    </Text>
                                </View>
                                <Pressable onPress={onCommentPress}>
                                    <MaterialIcon name={"comment"} size={25} style={{padding: 3, paddingTop: 5}}/>
                                </Pressable>
                                <Pressable onPress={onSharePress}>
                                    <MaterialIcon name={"ios-share"} size={25} style={{padding: 3, paddingTop: 5}}/>
                                </Pressable>
                                <Pressable onPress={onSavePress}>
                                    <MaterialIcon name={didUserSavePost ? "turned-in" : "turned-in-not"} size={25} style={{padding: 3, paddingTop: 5}}/>
                                </Pressable>
                            </View>
                        </View>
                        <PostCommentSection postComments={post.comments} postID={post._id}/>
                    </View>
                </>
                :
                <ExplorePageSkeleton />
            }
        </ScrollView>
    );
}

export { PostScreen };