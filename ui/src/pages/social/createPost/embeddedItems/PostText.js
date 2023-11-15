import React, { useState } from "react";
import { Pressable, Text, View, TouchableWithoutFeedback } from 'react-native';
import { opacityOnPressed } from "../../../../utils/helpers/colorHelper";
import { useUserFunctions } from "../../../../services/userServiceFunctions";

const PostText = ({ value, navigation }) => {
    const { fetchUserProfileByUsername } = useUserFunctions();

    const onMentionPress = async (mentionText) => {
        let username = mentionText.substring(1);
        
        // fetch the user's profile first to get there user id (we have no fetch user by username route and user id is not stored in the post)
        let user = await fetchUserProfileByUsername(username);

        navigation.navigate("ViewProfile", { userId: user?._id, isUsersOwnProfile: false })
    }

    /**
     * Like a simplified Pressable that doesn't look broken inline in `Text` on Android
     * Used to resolve issues within embedded Pressable embedded in text looking broken
     * And to resolve issues with Text OnPressIn/OnPressOut not working well. As per
     * https://stackoverflow.com/questions/66590167/vertically-align-pressable-inside-a-text-component
     */ 
    const TextButton = ({ children, onPress, style, ...rest }) => {
        const [pressed, setPressed] = useState(false)
        const onPressIn = () => setPressed(true)
        const onPressOut = () => setPressed(false)
    
        // TouchableWithoutFeedback modifies and returns its child; this returns `Text`
        // plus press in/out events attached that aren't supported by Text directly.
        return (
            <TouchableWithoutFeedback
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
            >
                <Text
                style={typeof style === 'function' ? style({ pressed }) : style}
                {...rest}
                >
                {typeof children === 'function' ? children({ pressed }) : children}
                </Text>
            </TouchableWithoutFeedback>
        )
    }

    const MentionPressableText = ({ text }) => {
        
        return (
            <TextButton onPress={() => onMentionPress(text)} style={({pressed}) => [{color: opacityOnPressed(pressed, '#0000ff', .7), fontSize: 14}]}>
                <Text>{text}</Text>
            </TextButton>
        )
    }

    /**
     * Takes text to be displayed but parses for mentions to display them within a blue pressable
     * @returns an array of <Text> components containing text either black or blue
     */
    const renderText = () => {

        if(!value)
            return ""

        let words = value.split(/([\n\r\s])/)
        let textItems = []


        // check if any words contain a SINGLE @ but with no other special characters
        let index = 0
        for(let word of words){

            if(word[0] === "@" && word.length > 1 && word.match(/^@[a-zA-Z0-9_.-]*$/)){
                textItems.push(<MentionPressableText text={word} key={word + index}></MentionPressableText>)
            }
            else {
                textItems.push(word)
            }
            index += 1
        }

        return textItems
    }

    return (
        <>
            <Text style={{display: 'flex', flexDirection: "row", flexWrap: 'wrap', marginTop: 8, justifyContent: 'flex-start'}}>
                {renderText()}
            </Text>
        </>
    )
}

export { PostText };