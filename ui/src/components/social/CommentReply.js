import React, { useState, useEffect } from "react";
import { Input, HStack, View, Popover, Text, Button, Center, Image, Pressable, ThreeDotsIcon, ArrowForwardIcon, AddIcon, CloseIcon } from 'native-base';
import { useAuth } from "../../services/authService";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CommentReply = (props) => {
    const { replyID, parentPost, parentComment } = props;
    const { userToken, user } = useAuth()

    const [replyData, setReplyData] = useState();
    const [replyLoaded, setReplyLoaded] = useState(false)
    const [formattedDate, setFormattedDate] = useState();
    const [replyMode, setReplyMode] = useState(false)
    const [subReply, setSubReply] = useState()

    useEffect(() => {
        getReplyData()
    }, [])

    const getReplyData = async() => {
        fetch('http://3.138.86.29/post/id/' + parentPost + '/comments/' + replyID,{
                method:'GET',
                headers: {  
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + userToken 
                }
            })
        .then((response) => response.json())        
        .then((response) => setReplyData(response))        
        .catch((e) => {throw e})

        //const dateObj = new Date(replyData.date); // create a new Date object from the string
        //setFormattedDate(`${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()}`);
        setReplyLoaded(true);
    }

    const submitEdit = async () => {

    }

    const deleteReply = async () => {
        fetch('http://3.138.86.29/post/id/' + parentPost + '/comments/' + replyID,{
            method:'DELETE',
            headers: {  
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + userToken 
            }
        })
        .then((response) => response.json())
        .catch((e) => {throw e})

        let deletedMessage = {...replyData}
        deletedMessage.text = '[deleted]'
        setReplyData(deletedMessage);
        //setEditMode(false)
    }

    const addSubReply = () => {
        const dbObj = {text: subReply}
        if(subReply?.length > 0){ //only allow replies with actual text
            fetch('http://3.138.86.29/post/id/' + parentPost + '/comments/' + replyID + '/replies',{
                method:'POST',
                headers: {  
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + userToken 
                },
                body: JSON.stringify(dbObj)
            })
            .then((response) => response.json())
            .catch((e) => {throw e})
            setSubReply('')
            setReplyMode(false)
        }
    }


    return(
        <View ml='6'>
            {replyData?
                <View borderWidth={1} borderColor='muted.100' pb='2'>
                    <HStack w='100%' justifyContent='space-between' alignItems='center'>
                        <HStack alignItems='center'>
                            <Image size={6} borderRadius={100} source={{uri: replyData.creatorId.profilePicURL}} alt="No Pic Found" />
                            <Text color='muted.400' bold ml='2'>{replyData.creatorId.name}</Text>
                        </HStack>
                        <HStack alignItems='center' mb='2'>
                            <Text color='muted.400'>{formattedDate}</Text>
                            {(user._id == replyData.creatorId._id)?
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
                                                <Button colorScheme="coolGray" variant="outline">Edit</Button>
                                                {/*<Button onPress={deleteReply} colorScheme="danger">Delete</Button>*/}
                                            </Button.Group>
                                        </Popover.Body>
                                    </Popover.Content>
                                </Popover>
                                :
                                <View></View>
                            }            
                        </HStack>
                    </HStack>
                    <Text>{replyData.text}</Text>
                    <View w='100%'>
                        {(replyMode == true)?
                            <HStack justifyContent='space-between' alignItems='center' m='2'>
                                <Pressable onPress={() => setReplyMode(false)}>
                                    <CloseIcon/>
                                </Pressable>
                                <Input value={subReply} onChangeText={text => setSubReply(text)} placeholder='reply to this comment' width='85%' mr='2'></Input>
                                <Pressable onPress={addSubReply} borderWidth={1} rounded={100}>
                                    <ArrowForwardIcon/>
                                </Pressable>
                            </HStack>
                            :
                            <View w='100%'>
                                <Pressable onPress={() => setReplyMode(true)} flexDirection='row' alignItems='center' m='2'>
                                    <AddIcon mr='2'/>
                                    <Text color='muted.400' underline>Reply</Text>
                                </Pressable>
                            </View>
                        }
                    </View>
                    {replyData.replies?
                        <View>
                            {replyData.replies.map((subReply, index) => {
                                return(
                                    <View key={'reply' + subReply._id}> 
                                       {<CommentReply replyID={subReply._id} parentPost={parentPost} parentComment={replyData._id}/>}
                                    </View>
                                )
                            })}
                        </View>
                    :<View/>}
                </View>
                :<View></View>
            }
        </View>
        
    )
}

export { CommentReply}