import React, { useState, useEffect } from "react";
import { Center, Button, View, ScrollView, Text, Pressable, TextInput, FlatList, RefreshControl} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PostHeader } from "../../components/social/PostHeader";
import { LogBox } from "react-native";
import { useFeed } from "../../services/feedService";
import { useAuth } from "../../services/authService";
import { usePosts } from "../../services/postService";

// ignoring issue with passing long text strings (items array) through navigation parameters
LogBox.ignoreLogs([   'Non-serializable values were found in the navigation state', ]);

const Feed = ({ navigation, posts }) => {    
    const [isRefreshing, setIsRefreshing] = useState(false)

    const { feed, refetchFeed } = useFeed();
    const { user } = useAuth();
    const { likePost, dislikePost, resetLikeState } = usePosts();

    const onPostPress = (post) => {
        navigation.navigate("Post", { postId: post?._id});
    }

    const PostItem = ({ item }) => {
        post = item?.item
        index = item?.index

        const [hasUserLiked, setHasUserLiked] = useState(post?.likes?.filter(likeUser => likeUser._id === user._id).length > 0)
        const [hasUserDisliked, setHasUserDisliked] = useState(post?.dislikes?.filter(likeUser => likeUser._id === user._id).length > 0)

        const refectPostData = () => {
            refetchFeed();
        }

        const onLikePress = async (postId) => {
            let isLiking = !hasUserLiked
            let res;

            // update state
            setHasUserLiked(prev => !prev)
            setHasUserDisliked(false)
    
            // send like/unlike request
            if(isLiking){
                res = await likePost(postId)
            }
            else {
                res = await resetLikeState(postId)
            }
    
            refectPostData();
        }
    
        const onDislikePress = async (postId) => {
            let isDisliking = !hasUserDisliked

            // update state
            setHasUserDisliked(prev => !prev)
            setHasUserLiked(false)
        
            // send dislike/undislike request
            if(isDisliking){
                res = await dislikePost(postId)
            }
            else {
                res = await resetLikeState(postId)
            }
            
            refectPostData();
        }

        return (
            <Pressable onPress={() => onPostPress(item?.item)} style={{borderBottomWidth: 1, borderColor: 'lightgrey', marginHorizontal: 10, marginVertical: 5, width: "100%", paddingBottom: 10}}>
                <PostHeader post={post} navigation={navigation}/>
                <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: "100%"}}>
                        <Text style={{fontSize: 20, fontWeight: "bold"}}>{post?.title}</Text>
                    </View>
                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: "100%"}}>
                        { (post.items && post.items[0] && post?.items?.[0]?.type === "text") &&
                            <Text style={{fontSize: 14, fontWeight: "normal"}}>
                                {post?.items?.[0].text?.length > 300 ? (post?.items?.[0]?.text?.substring(0, 300) + "...") : post?.items?.[0]?.text?.trim()}
                            </Text>
                            // do .trim() above? or .split("\n")[0] ? show newline content or cut it off
                        }
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginTop: 10}}>
                        <Pressable onPress={() => onLikePress(post?._id)}>
                            <Icon name={hasUserLiked ? "thumb-up" :"thumb-up-outline"} size={20} style={{padding: 3, paddingTop: 5}}/>
                        </Pressable>
                        <Text style={{marginRight: 10}}>{post?.likeCount || 0}</Text>
                        <Pressable onPress={() => onDislikePress(post?._id)}>
                            <Icon name={hasUserDisliked ? "thumb-down" : "thumb-down-outline"} size={20} style={{padding: 3, paddingTop: 5}}/>
                        </Pressable>
                        <Text>{post?.dislikeCount || 0} </Text>
                    </View>
                </View>
            </Pressable>
        )
    }

    return (
        <View style={{flex: 1}}>
            { posts?.length !== 0 ?
                <FlatList 
                    data={posts ? posts : feed}
                    renderItem={(item) => <PostItem item={item} />}
                    keyExtractor={post => post?._id}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={() => setTimeout(() => setIsRefreshing(false), 1000)} />
                    }
                    />
                :
                <View style={{margin: 10}}>
                    <Text style={{fontSize: 20}}>No posts :(</Text>
                </View>
            }
        </View>
    )
}

export { Feed };