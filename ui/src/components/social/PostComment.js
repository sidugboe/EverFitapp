import React, { useState, useEffect } from "react";
import { Input, HStack, View, Popover, Text, Button, Center, Image, Pressable, ThreeDotsIcon, ArrowForwardIcon, AddIcon, CloseIcon  } from 'native-base';
import { useAuth } from "../../services/authService";
import { CommentReply } from "./CommentReply";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PostComment = (props) => {
    let commentData = props.commentData;
    const dateObj = new Date(commentData.date); // create a new Date object from the string
    const formattedDate = `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()}`; 
    const { userToken, user } = useAuth()
    const [comment, setComment] = useState(commentData.text);
    const [editMode, setEditMode] = useState(false);
    const [replyMode, setReplyMode] = useState(false);
    const [reply, setReply] = useState('');
    
    const editComment = () => {setEditMode(true)}
    const newReply = () => {setReplyMode(true)}
    const exitReplyMode = () => {setReplyMode(false)}
    const submitEdit = async () => {
        const dbObj = {
            text: comment
        }
        await fetch('http://3.138.86.29/post/id/' + props.parentPost + '/comments/' + commentData._id,{
            method:'PUT',
            headers: {  
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + userToken 
            },
            body: JSON.stringify(dbObj)
        })
        .then((response) => response.json())
        .catch((e) => {throw e})
        setEditMode(false)
    }

    const deleteComment = async () => {
        await fetch('http://3.138.86.29/post/id/' + props.parentPost + '/comments/' + commentData._id,{
            method:'DELETE',
            headers: {  
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + userToken 
            }
        })
        .then((response) => response.json())
        .catch((e) => {throw e})
        setComment('[deleted]')
        setEditMode(false)
    }

    const addReply = async () => {
        const dbObj = {text: reply}
        if(reply?.length > 0){ //only allow replies with actual text
            await fetch('http://3.138.86.29/post/id/' + props.parentPost + '/comments/' + commentData._id + '/replies',{
                method:'POST',
                headers: {  
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + userToken 
                },
                body: JSON.stringify(dbObj)
            })
            .then((response) => response.json())
            .catch((e) => {throw e})
            setReply('')
            setReplyMode(false)
        }
    }

    return(
        <View width='100%' borderBottomWidth={1} borderColor='#cccccc' py='2'>
            <HStack w='100%' justifyContent='space-between' alignItems='center'>
                <HStack alignItems='center' mb='2'>
                    <Image size={6} borderRadius={100} source={{uri: commentData.creatorId.profilePicURL}} alt="No Pic Found" />
                    <Text color='muted.400' bold ml='2'>{commentData.creatorId.name}</Text>
                </HStack>
                <HStack alignItems='center' mb='2'>
                    <Text color='muted.400'>{formattedDate}</Text>
                    {(user._id == commentData.creatorId._id)?
                    <Popover placement="left" trigger={triggerProps => {
                    return <Pressable {...triggerProps} colorScheme="danger" ml='2'>
                                <Icon name="dots-horizontal" size={18}/>
                            </Pressable>;
                    }}>
                        <Popover.Content accessibilityLabel="Delete Customerd" w="56">
                            <Popover.Arrow />
                            <Popover.CloseButton/>
                            <Popover.Header>Manage comment</Popover.Header>
                            <Popover.Body>
                                <Button.Group space={2}>
                                    <Button onPress={editComment} colorScheme="coolGray" variant="outline">Edit</Button>
                                    <Button onPress={deleteComment} colorScheme="danger">Delete</Button>
                                </Button.Group>
                            </Popover.Body>
                        </Popover.Content>
                    </Popover>
                    :
                    <View></View>
                    }            
                    
                </HStack>
            </HStack>
            {editMode?
                <Center>
                    <HStack justifyContent='space-between' alignItems='center' mx='2'>
                        <Input value={comment} onChangeText={text => setComment(text)} width='85%' mr='2'></Input>
                        <Pressable onPress={submitEdit} borderWidth={1} rounded={100}>
                            <ArrowForwardIcon/>
                        </Pressable>
                    </HStack>
                </Center>
                :
                <View>
                    <Text>{comment}</Text>
                </View>
            }
            <View w='100%'>
                {(replyMode == true)?
                    <HStack justifyContent='space-between' alignItems='center' m='2'>
                        <Pressable onPress={exitReplyMode}>
                            <CloseIcon/>
                        </Pressable>
                        <Input value={reply} onChangeText={text => setReply(text)} placeholder='reply to this comment' width='85%' mr='2'></Input>
                        <Pressable onPress={addReply} borderWidth={1} rounded={100}>
                            <ArrowForwardIcon/>
                        </Pressable>
                    </HStack>
                    :
                    <View w='100%'>
                        <Pressable onPress={newReply} flexDirection='row' alignItems='center' m='2'>
                            <AddIcon mr='2'/>
                            <Text color='muted.400' underline>Reply</Text>
                        </Pressable>
                    </View>
                }
            </View>
            {commentData.replies?
                <View>
                    {commentData.replies.map((reply, index) => {
                        return(
                            <CommentReply replyID={reply} parentPost={props.parentPost} parentComment={commentData._id} key={'reply' + index}/>
                        )
                    })}
                </View>
            :<View/>}
        </View>
    )
}

export { PostComment };