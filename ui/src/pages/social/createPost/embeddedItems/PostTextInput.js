import React, { useState, useEffect, useRef } from "react";
import { Text, TextInput } from 'react-native';

const PostTextInput = ({ recentlyEditedText, value, onChangeText, placeholder, isMostRecentText, mentionTextResult, setMentionText, key }) => {
    const [text, setText] = useState(value)
    const isAddingMentionTextHere = useRef(false)
    const [mentionTextLocation, setMentionTextLocation] = useState(NaN)
    const inputRef = useRef(0)

    const onTextChange = (text) => {
        recentlyEditedText.current = inputRef.current

        // if they enter @ then don't add it
        let words = text.split(" ") // let words = text.split(/\s+/);
        let newText = "";

        // note this logic completely breaks if they paste text with multiple single @'s
        for(let [index, word] of words.entries()){
            
            if(word === "@"){
                setMentionTextLocation(newText.length - 1)
                setMentionText("@")
                // set return location to the location of this @ so the full mention is added back here
            }
            else if(index != words.length - 1)
                newText += word + " "
            else
                newText += word
        }

        setText(newText)
        // onChangeText(newText) re3moved to useEffect but leaving it in in case something breaks
    }

    // whenever the text state changes update the parent state
    useEffect(() => {
        if(text)
            onChangeText(text)
    }, [text])

    useEffect(() => {
        // add the mentin text search results back to where the mention symbol was added
        if(mentionTextResult && recentlyEditedText.current === inputRef.current){
            if(mentionTextLocation){
                setText(prev => (prev.substring(0, mentionTextLocation) + " " + mentionTextResult + prev.substring(mentionTextLocation)))
                setMentionTextLocation(NaN)
            }
            else
                setText(prev => prev + mentionTextResult + " ")
            
        }
    }, [mentionTextResult])

    /**
     * Takes text to be displayed but parses for mentions to display them in blue
     * @returns an array of <Text> components containing text either black or blue
     */
    const renderChildText = () => {

        if(!text)
            return <Text key={"text-placeholder"}></Text>

        let words = text.split(" ") // let words = text.split(/\s+/);
        let textItems = []

        // check if any words contain a SINGLE @ but with no other special characters
        let index = 0
        for(let word of words){

            // remove the @ as it will be added back after the user enters the @mention in mention input
            if(word === "@"){
                // setText(prev => prev.substring(0, prev.length - 1))
                isAddingMentionTextHere.current = true; // update value so that the value retunred from mention text is sent here
                continue;
            }

            // otherwise check for an entire @mention word and if so, highlight it in blue
            if(word[0] === "@" && word.length > 1 && (word.includes("/n") ? word.split("/n") : word).match(/^@[a-zA-Z0-9_.-]*$/)){
                textItems.push(<Text style={{color: 'blue'}}  key={key + "-mentionsubtext-" + index}>{index !== 0 ? " " + word : word}</Text>)
            }
            else {
                textItems.push(<Text key={key + "-subtext-" + index}>{index !== 0 ? " " + word : word}</Text>)
            }
            index += 1
        }

        return textItems
    }

    return (
        <>
        <TextInput ref={inputRef} onChangeText={onTextChange} multiline={true} placeholder={placeholder} style={{fontSize: 20, backgroundColor: '#E8E8E8', textAlignVertical: "top", borderRadius: 10, height: isMostRecentText ? 800 : undefined}}>
            {renderChildText()}
        </TextInput>
        </>
    )
}

export { PostTextInput };