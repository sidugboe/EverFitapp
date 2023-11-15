import React, { useState, useEffect } from "react";
import { Button, View, Text, Input, TextArea, ArrowForwardIcon, Pressable, HStack, Divider  } from 'native-base';
import { PostComment } from "./PostComment";
import { useAuth } from "../../services/authService";


const PostCommentSection = (props) => {
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState(props.postComments)
    const { userToken } = useAuth()
    const parentPost = props.postID;

    // DUMMY DATA ----------------------------------------------------
    /*
    comments = [
        {
            "creatorId": "123456789",
            "date": "2022-03-15T09:30:00Z",
            "text": "Test Comment 1",
            "_id": "111"
        },
        {
            "creatorId": "987654321",
            "date": "2022-03-16T09:30:00Z",
            "text": "Test Comment 2",
            "_id": "222"
        },
        {
            "creatorId": "000000000",
            "date": "2022-03-17T09:30:00Z",
            "text": "Test Comment 3",
            "_id": "333"
        }
    ]*/
    // ---------------------------------------------------------------

    const onMakeComment = async () => {
        const dbObj = {
            text: newComment
        }

        await fetch('http://3.138.86.29/post/id/' + parentPost + '/comments',{
            method:'POST',
            headers: {  
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + userToken 
            },
            body: JSON.stringify(dbObj)
        })
        .then((response) => response.json())
        .catch((e) => {throw e})
        setNewComment('')
    }

    return (
        <View width='100%'>
            <HStack alignItems='flex-end'>
                <TextArea  placeholder="Add a comment" value={newComment} onChangeText={text => setNewComment(text)} h={20} w="80%" maxW="300" m='2'/>
                <Pressable onPress={onMakeComment} borderWidth={1} rounded={1000} p='2' ml='2' mb='3'>
                    <ArrowForwardIcon/>
                </Pressable>
            </HStack>
            {comments?
                <View>
                    <Divider/>
                    {comments.map((element, index) => {
                        return(
                            <PostComment commentData={element} key={'comment'+index} parentPost={parentPost} numComments={comments.length}/>
                        )
                    })}
                </View>
            : // Blank display if no comments are found
                <Text style={{margin: 20, fontSize: 20}}>No Comments Yet</Text>
            }
        </View>
    )
}

export { PostCommentSection };