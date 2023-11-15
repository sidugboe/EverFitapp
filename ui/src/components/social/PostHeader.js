import React, { useState, useEffect } from "react";
import { Center, Button, View, ScrollView, Text, Pressable, TextInput, FlatList} from 'react-native';
import { opacityOnPressed } from "../../utils/helpers/colorHelper";
import { getTimeSinceDate } from "../../utils/helpers/dateHelper";

const PostHeader = ({ post, navigation }) => {

    const onTagPress = (tag) => {
        navigation.navigate("TagPosts", { tag: tag});
    }

    const onUserPress = () => {
        navigation.navigate("ViewProfile", { userId: post.creatorId?._id })
    }

    return (
            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <Pressable onPress={onUserPress} hitSlop={5} style={({pressed}) => [{}]}>
                    {({pressed, color = "#808080"}) => (
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{fontSize: 15, color: opacityOnPressed(pressed, color, .7)}}>{post.creatorId.name}</Text>
                        </View>  
                    )}
                </Pressable>
                <Text style={{fontSize: 18, paddingHorizontal: 8}}>
                            {'•'}
                </Text>
                <Text style={{fontSize: 15}}>
                    {getTimeSinceDate(post.date)}
                </Text>
                { (post.tags && post.tags?.length !== 0) &&
                    <>
                        <Text style={{fontSize: 18, paddingHorizontal: 8}}>
                            {'•'}
                        </Text>
                        <View style={{display: 'flex', flexDirection: 'row'}}>
                            { post.tags?.map((topic, index) => {   
                                return (
                                    <Pressable onPress={() => onTagPress(topic)} hitSlop={5} key={"post-" + post._id + "-topic-" + index} style={{backgroundColor: '#3d5ddb', borderRadius: 20, marginRight: 2, height: 20, paddingHorizontal: 6, display: "flex", flexDirection: 'row',alignItems: "center", minWidth: 23, justifyContent: "space-around"}}>
                                        <Text style={{fontSize: 11, color: 'white'}}>{topic}</Text>
                                    </Pressable>
                                )
                                })
                            }
                        </View>
                    </>
                }
                {/* <Icon name="search" size={25} style={{padding: 3, paddingTop: 5}}/> */}
            </View>
    )
}

export { PostHeader };