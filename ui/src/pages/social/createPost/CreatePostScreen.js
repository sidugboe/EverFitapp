import React, { useState, useEffect, useRef } from "react";
import { Center, Button, View, Text, Pressable, TextInput, StyleSheet, Keyboard, ScrollView, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { default as CommunityIcon } from 'react-native-vector-icons/MaterialCommunityIcons';
import { addOpacityRGB, opacityOnPressed, pSBC } from "../../../utils/helpers/colorHelper";
import { TrainingLibraryOverlay } from "../../../components/trainingLibrary/TrainingLibraryOverlay";
import { EmbeddedItemGroup } from "./embeddedItems/EmbeddedItemGroup";
import { default as IonIcon } from 'react-native-vector-icons/Ionicons';
import { EmbeddedWorkout } from "./embeddedItems/EmbeddedWorkout";
import { EmbeddedExercise } from "./embeddedItems/EmbeddedExercise";
import { CreatePostHeader } from "../../../components/appbars/CreatePostHeader";
import { EmbeddedRoutine } from "./embeddedItems/EmbeddedRoutine";
import { useAuth } from "../../../services/authService";
import { useUserFunctions } from "../../../services/userServiceFunctions";
import { PostTextInput } from "./embeddedItems/PostTextInput";

const DEFAULT_PROFILE_URL = "https://everfit-images.s3.us-east-2.amazonaws.com/photo.png"
const NESTING_BACKGROUND_COLORS = {
    0: "#D3D3D3",
    1: "#C8C8C8",
    2: "#F0F0F0",
    3: "#E0E0E0", // max nesting would be 3 being: group (0) > routine (1) > workout (2) > exercise (3)
    4: "#F8F8F8",
}

const groupTypeMessageColor = "#808080"

const CreatePostScreen = ({ navigation, route}) => {

    const bodyInput = useRef(0);
    const mentionTextInput = useRef(0)
    const isLoaded = useRef(false);
    const recentlyEditedText = useRef(0)
    const mentionTextResult = useRef("")
    const [titletext, setTitleText] = useState("")
    const [showAccessoryBar, setShowAccessoryBar] = useState(false)
    const [isAddItemViewOpen, setIsAddItemViewOpen] = useState(false);
    const [trainingLibrarySettings, setTrainingLibrarySettings] = useState({isVisible: false, mode: "selectMultiple", itemType: "", onConfirmItems: "", shouldConfirm: true});  // object for training library settings { isVisible: true | false, mode: "some mode", itemType: "exercises", onConfirmItems: function, confirmationModalTitle: "some string", confirmationModalBody: "some body"}
    const [postItems, setPostItems] = useState([{type: "text", text: ""}]); // initialize post items to one text item to render the initial body
    const [newestPostItem, setNewestPostItem] = useState(-1);
    const [recentlyAddedItems, setRecentlyAddedItems] = useState([])    // idex referring to the first of the new post items that are added from the library so we know to render the grouping options above it
    const [groupingType, setGroupingType] = useState("") // "type", "seperate", "" <- no group and items can't be grouped anyways
    const [canSubmitPost, setCanSubmitPost] = useState(false);
    const [postItemCreators, setPostItemCreators] = useState({})
    const [mentionText, setMentionText] = useState("")
    const [mentionSearchResults, setMentionSearchResults] = useState([]);

    const { user } = useAuth();
    const { fetchItemCreators, searchUsersByUserName } = useUserFunctions();

    // programatically fixes issue where android keyboard dismiss with back button doesn't unfocus from input so pressing input again doesn't re-focus input - so manually unfocus on keyboard close
    useEffect(() => {
        const kListener = Keyboard.addListener('keyboardDidHide', () => {
          Keyboard.dismiss();
          setShowAccessoryBar(false);
          setIsAddItemViewOpen(false)
        });

        // listens for keyboard opening so acessory bar can be hidden
        const willShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setShowAccessoryBar(true);
        });
    
        return () => {
          kListener.remove();
          willShowListener.remove()
        };
    }, []);

    const onMentionPress = () => {
        setMentionText("@");
    }

    useEffect(() => {
        if(!mentionText){
            // prevent body text focus on initial render. Otherwise whenever mention text removed, focus the body text again
            if(!isLoaded.current)  
                isLoaded.current = true
            else {
                recentlyEditedText?.current?.focus?.()    // set timeout fixed issue where keyboard hide from 
                setMentionSearchResults([])
            }
            // todo note this logic will need to be changed if we allow for "twitter like" posts with only header/title. Then we will need to re-focus back to title text
            // in that case the "isLoaded" ref would need to be changed to a "mostRecentInput" ref or somt
        }
        else if(mentionText === "@"){
            mentionTextInput.current.focus()
            setMentionSearchResults([])
        }

        // else, update the mention search results
        else {
            let searchQuery = mentionText.substring(1)  // remove @ from start of mention text
            fetchMentionUserResults(searchQuery);
        }

    }, [mentionText])

    /**
     * Fetches users by the mention search text
     */
    const fetchMentionUserResults = async (searchText) => {
        let userSearchResults = await searchUsersByUserName(searchText)
        setMentionSearchResults(userSearchResults)
    }

    /**
     * Fetches the user records for the creators of the provided items
     * @param {Array} items the list of items that creators are being fetched for. All items must contain a creeatorId property
     */
    const fetchPostItemCreators = async (items) => {
        // could add logic here to check if creator ids are already in the postItemCreators map to prevent extra requests but leaving it for now
        let itemToCreatorMap = await fetchItemCreators(items, user)
        let creators = {...postItemCreators};

        // update the post item creators map with the new item keys
        for(let key of Object.keys(itemToCreatorMap)){
            creators[key] = itemToCreatorMap[key]
        }

        setPostItemCreators(creators)
    }

    const onTitleChange = (text) => {
        setTitleText(text)
        setCanSubmitPost(text.length !== 0)
    }

    const onTextChange = (text, itemNumber) => {
        
        // if it is a placeholder text hide the option to switch grouping
        let shouldRemovePlaceholderFields = false
        if(postItems[itemNumber].isPlaceholder){
            setGroupingType("");
            shouldRemovePlaceholderFields = true; // set to true so we remove all placeholder fields on all placeholder texts - leave them in now as group can no longer be changed after changing a placeholder value
        }

        // update the item corresponding to the provided input
        setPostItems(prev => prev?.map((item, index) => {
            let originalItem;

            // remove the placeholder field if required to
            if(shouldRemovePlaceholderFields){
                originalItem = {...item}
                delete originalItem.isPlaceholder
            }
            else
                originalItem = {...item}

            return index === itemNumber ? {type: 'text', text: text} : originalItem
        }))
    }

    const onInsertItemPress = () => {
        setIsAddItemViewOpen(true)
    }

    const onAttachItemPress = () => {
        Keyboard.dismiss();
    }

    const onAddTrainingItem = () => {
        setTrainingLibrarySettings(prev => ({...prev, isVisible: true, onConfirmItems: onConfirmTrainingItems, shouldConfirm: true,confirmationModalTitle: 'Add selected items?', confirmationModalBody: "Note that private items will be set to public in order to be viewed within the post."}))
    }

    // called from within TrainingLibraryOverlay after user confirms selected items
    // second param added as work around
    const onConfirmTrainingItems = (items, localPostItems) => {

        // fetch the creators of the post item records so that their name can be shown on the embedded items
        fetchPostItemCreators(items);

        // group the items by type by default (but user can switch to arrange items individually)
        let routines = [], exercises = [], workouts = [];
        for(let item of items){
            if(item.type.toLowerCase() === "routine"){
                routines.push(item)
            }
            else if(item.type.toLowerCase() === "workout"){
                workouts.push(item)
            }
            else if(item.type.toLowerCase() === "exercise"){
                exercises.push(item)
            }
            else {
                // unknown type
            }
        }

        let newItems = [];
        let isGroupingEnabled = false;

        // create group items and add empty text item after each group so user can type between
        let emptyTextItem = {type: "text", text: "", isPlaceholder: true}
        if(routines.length){
            newItems.push({type: "routine", routines: [...routines]})
            newItems.push(emptyTextItem)

            if(routines.length > 1)
                isGroupingEnabled = true;
        }
        if(workouts.length){
            newItems.push({type: "workout", workoutTemplates: [...workouts]})
            newItems.push(emptyTextItem)

            if(workouts.length > 1)
                isGroupingEnabled = true;
        }
        if(exercises.length){
            newItems.push({type: "exercise", exerciseTemplates: [...exercises]})
            newItems.push(emptyTextItem)

            if(exercises.length > 1)
                isGroupingEnabled = true;
        }

        if(isGroupingEnabled){
            setGroupingType("type")
        }
        else {
            setGroupingType("") // so that option to switch isn't shown
        }

        // then add the groups of items to the post items with a body of text in between the types
        setNewestPostItem(localPostItems ? localPostItems?.length : postItems.length)
        setPostItems(prev => [...prev, ...newItems]);

        // keep recently added items in case user doesn't want to show in grouped format
        setRecentlyAddedItems(items);
    }

    // uses the recentlyAddedItems stats to re-arrange the added items to be individual rather than grouped
    const arrangeItemsIndividually = () => {
        // update mode in case user wants to change it back
        setGroupingType("seperate")

        // remove the recently added items from the postItems array
        setPostItems(prev => prev.filter((item, index) => index < newestPostItem))

        // generate new items to re-add to the array
        let emptyTextItem = {type: "text", text: "", isPlaceholder: true}
        let newPostItems = [];
        for(let item of recentlyAddedItems){
            if(item.type.toLowerCase() === "routine"){
                newPostItems = [...newPostItems, {type: "routine", routines: [item]}, emptyTextItem]    // add empty text item after every item
            }
            else if(item.type.toLowerCase() === "workout"){
                newPostItems = [...newPostItems, {type: "workout", workoutTemplates: [item]}, emptyTextItem]    // add empty text item after every item
            }
            else if(item.type.toLowerCase() === "exercise"){
                newPostItems = [...newPostItems, {type: "exercise", exerciseTemplates: [item]}, emptyTextItem]
            }
            else {
                // unknown type
            }
        }

        // apply the changes to post items with new ungrouped items
        setPostItems(prev => [...prev, ...newPostItems])

        // re focus the input - this doesn't work for some reason
        // bodyInput.current.focus();
    }

    const renderPostItem = (item, index) => {

        // get the index of the most recent text so it can be rendered with a larger height
        let indexOfMostRecentText = 0;
        postItems.forEach((item, index) => item.type === "text" ? indexOfMostRecentText = index : null)
        let isMostRecentText = index == indexOfMostRecentText;  // keep track of bottom text item as it's height should be much larger

        if(item.type === "text"){

            return (
                <PostTextInput recentlyEditedText={recentlyEditedText} setMentionText={setMentionText} mentionTextResult={mentionTextResult.current} value={postItems[index].text} onChangeText={(value) => onTextChange(value, index)} placeholder={(index == 0 && postItems.length == 1) ? " Body" : undefined} multiline={true} textRef={isMostRecentText ? bodyInput : undefined} isMostRecentText={isMostRecentText} key={"post-text-" + index}/>
            )
        }
        else if(item.type === "routine"){
            // if more than one routine (in group) then render multi card
            if(item.routines?.length > 1){
                return (
                    <EmbeddedItemGroup itemType={"routine"} items={item.routines} itemCreators={postItemCreators} onDelete={() => onItemDelete(index)}/>
                )
            }

            // else return single routine card
            return (
                <EmbeddedRoutine item={item.routines[0]} creator={postItemCreators[item.routines[0]._id]} onDelete={() => onItemDelete(index)}/>
            )
        }
        else if(item.type === "workout"){

            // if more than one workout (in group) then render multi card
            if(item.workoutTemplates?.length > 1){
                return (
                    <EmbeddedItemGroup itemType={"workout"} items={item.workoutTemplates} itemCreators={postItemCreators} onDelete={() => onItemDelete(index)}/>
                )
            }

            // else render single workout card
            return (
                <EmbeddedWorkout item={item.workoutTemplates[0]} creator={postItemCreators[item.workoutTemplates[0]._id]} onDelete={() => onItemDelete(index)}/>
            )
        }
        else if(item.type === "exercise"){

            // if more than one exercise (in group) then render multi card
            if(item.exerciseTemplates?.length > 1){
                return (
                    <EmbeddedItemGroup itemType={"exercise"} items={item.exerciseTemplates} itemCreators={postItemCreators} onDelete={() => onItemDelete(index)}/>
                )
            }
            return (
                <EmbeddedExercise item={item.exerciseTemplates[0]} creator={postItemCreators[item.exerciseTemplates[0]._id]} onDelete={() => onItemDelete(index)}/>
            )
        }
        else 
            return <></>
    }

    const setItemsToGrouped = () => {
        if(groupingType == "type"){

        }
        else {
            // remove the recently added items form the postItems array and re-add them with groups
            setGroupingType("type");

            // remove the recently added items from the postItems array
            let newPostItems = postItems.filter((item, index) => index < newestPostItem)
            setPostItems(prev => newPostItems)

            // clean up the recently added items
            let itemsWithoutPLaceholderText = []
            for(let item of recentlyAddedItems){
                if(item.type === "text" && item.text == "")
                    continue;
                else
                    itemsWithoutPLaceholderText.push(item)
            }

            // passing second param as work around because when we update post items above and call this function they won't be updated when it runs because react state is amazing yay
            onConfirmTrainingItems(itemsWithoutPLaceholderText, newPostItems);  // function could be called groupItems but is called directly from training library
        }
    }

    let bgColorGroup;
    let bgColorSeperate;
    if(groupingType == "type"){
        bgColorGroup = "#C0C0C0"
        bgColorSeperate = NESTING_BACKGROUND_COLORS[0]
    }
    else {
        bgColorGroup = NESTING_BACKGROUND_COLORS[0]
        bgColorSeperate = "#C0C0C0"
    }

    const onNextPress = () => {
        // remove placeholder items from the post
        let items = postItems.filter((item) => !item.isPlaceholder)

        // remove empty text items
        items = items.filter((item) => !(item.type === "text" && item.text === ""))

        // setup post item to be created
        let newPost = {
            title: titletext,
            items: items,
            tags: []
        }

        // navigate to submit post and pass post items along
        navigation.navigate("SubmitPost", { post: newPost})
    }

    // remove an item from the post items depending on the item type
    const onItemDelete = (index) => {
        setPostItems(prev => prev.filter((item, itemIndex) => itemIndex !== index))

        // hide grouping message and reset grouping type if it is set
        setGroupingType("")
    }

    const onMentionSearchResultPress = (result) => {
        mentionTextResult.current = result
        setTimeout(() => mentionTextResult.current = "", 300)
        setMentionText("")
    }

    const renderMentionTextResults = ( 
        <>
            { mentionSearchResults?.map((user, index) => {

                return (
                    <Pressable onPress={() => onMentionSearchResultPress("@" + user.username)} style={({pressed}) => [{ height: 45, display: 'flex', flexDirection: 'row', alignItems: 'center', width: "100%", borderRadius: 10, paddingHorizontal: "1%", backgroundColor: pressed ? pSBC(.7, '#E8E8E8') : '#E8E8E8', marginTop: 5}]} key={"mention-result-" + index}>
                        <View style={{width: 30, height: 30, borderRadius: 40, borderWidth: 0.2, marginHorizontal: 5, marginRight: 7, overflow: "hidden"}}>
                            <Image source={{ uri: user?.profilePicURL ? user?.profilePicURL : DEFAULT_PROFILE_URL }} style={{ width: 30, height: 30}} />
                        </View>
                        <View style={{display: 'flex', flexDirection: 'column'}}>
                            <Text style={{fontSize: 16, fontWeight: "bold"}}>{user.name}</Text>
                            <Text style={{fontSize: 15}}>{user.username}</Text>    
                        </View>
                    </Pressable>
                )
            })}
            {/* Render text below the results for if the user wants to add the text even if not shown in the result  */}
            { mentionText.length > 1 &&
                <Pressable onPress={() => onMentionSearchResultPress(mentionText)} style={({pressed}) => [{ height: 30, display: 'flex', flexDirection: 'row', alignItems: 'center', width: "100%", borderRadius: 10, paddingHorizontal: "2%", backgroundColor: pressed ? pSBC(.9, '#000000') : '#ffffff', marginTop: 10}]} key={"mention-choose-default"}>
                    <View style={{display: 'flex', flexDirection: 'column'}}>
                        <Text style={{fontSize: 16, color: "rgb(250, 20, 20)"}}>{"Mention user " + mentionText}</Text>    
                    </View>
                </Pressable>
            } 
        </>
    )

    return (
        <View style={{height: "100%", margin: 6}}>
            <CreatePostHeader navigation={navigation} canSubmitPost={canSubmitPost} onNext={onNextPress} postItems={postItems} postTitle={titletext}/>
            <TrainingLibraryOverlay navigation={navigation} onClose={() => setTrainingLibrarySettings(prev => ({...prev, isVisible: false}))} {...trainingLibrarySettings}/>
                <ScrollView style={{ height: "100%"}}>
                    <TextInput onChangeText={setMentionText} value={mentionText} ref={mentionTextInput} style={{display: mentionText ? undefined : "none", color: 'blue', fontSize: 20, backgroundColor: '#E8E8E8', textAlignVertical: "top", borderRadius: 10, height: 45}}></TextInput>
                    {renderMentionTextResults}
                    <TextInput onChangeText={onTitleChange} placeholder={"Title"} multiline={false} style={{backgroundColor: '#E8E8E8', fontSize: 30, borderRadius: 10, marginBottom: 4, display: mentionText ? "none" : undefined}}/>
                    <View style={{backgroundColor: '#E8E8E8', borderRadius: 10, marginBottom: 10, display: mentionText ? "none" : undefined}}>
                    { postItems?.map((item, index) => {

                        return (
                            <React.Fragment key={"item-" + index}>
                                { (index == newestPostItem && groupingType != "") &&
                                    <View style={{display: 'flex', flexDirection: 'column', marginLeft: 10}}>
                                        <View>
                                            <Text style={{fontSize: 13, color: groupTypeMessageColor}}>Added items grouped by type. Do you want them to be displayed seperately? Click to preview</Text>
                                        </View>
                                        <View style={{display: 'flex', flexDirection: 'row'}}>
                                            <View>
                                                <Pressable onPress={arrangeItemsIndividually} style={({pressed}) => [{backgroundColor: opacityOnPressed(pressed, bgColorSeperate), borderRadius: 12, width: 100, paddingRight: 8, marginBottom: 5, marginRight: 6}]}>
                                                    { ({pressed}) => {                                        
                                                        return (
                                                            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: 85}}>
                                                                <CommunityIcon name={"format-line-spacing"} size={25} style={{padding: 3, paddingTop: 5, color: pressed ? addOpacityRGB(groupTypeMessageColor, .7) : groupTypeMessageColor}}/>
                                                                <Text style={{color: pressed ? addOpacityRGB(groupTypeMessageColor, .7) : groupTypeMessageColor}}>Seperate</Text>
                                                            </View>
                                                        )}
                                                    }                   
                                                </Pressable>
                                            </View>
                                            <View>
                                                <Pressable onPress={setItemsToGrouped} style={({pressed}) => [{backgroundColor: opacityOnPressed(pressed, bgColorGroup), borderRadius: 12, width: 100, paddingRight: 8, marginBottom: 5, marginRight: 6}]}>
                                                    { ({pressed}) => (
                                                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: 85}}>
                                                            <CommunityIcon name={"format-list-group"} size={25} style={{padding: 3, paddingTop: 5, color: pressed ? addOpacityRGB(groupTypeMessageColor, .7) : groupTypeMessageColor}}/>
                                                            {/* Icon alternatives: "format-vertical-align-center" || "format-list-bulleted-type" || "format-list-text" || "format-list-checkbox" */}
                                                            <Text style={{color: pressed ? addOpacityRGB(groupTypeMessageColor, .7) : groupTypeMessageColor}}>Grouped</Text>
                                                        </View>
                                                    )}                   
                                                </Pressable>
                                            </View>
                                        </View>
                                    </View>
                                }
                                {renderPostItem(item, index)}
                            </React.Fragment>
                        )
                    })}
                </View>
            </ScrollView>
            { (showAccessoryBar && !isAddItemViewOpen) &&
                <ScrollView horizontal={true} style={{height: 70}} keyboardShouldPersistTaps={'always'}>
                    <View>
                        <Pressable onPress={onInsertItemPress} style={({pressed}) => [{backgroundColor: opacityOnPressed(pressed, "#E8E8E8"), width: 120, ...styles.AccessoryBarPressable}]}>
                            { ({pressed}) => (
                                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                                    <Icon name={"insert-link"} size={27} style={{padding: 3, paddingTop: 5, color: pressed ? addOpacityRGB("#585858", .7) : "#585858"}}/>
                                    <Text style={{color: pressed ? addOpacityRGB("#585858", .7) : "#585858"}}>Insert Item</Text>
                                </View>
                            )}                        
                        </Pressable>
                    </View>
                    <View>
                        <Pressable onPress={onAttachItemPress} style={({pressed}) => [{backgroundColor: opacityOnPressed(pressed, "#E8E8E8"), width: 120, ...styles.AccessoryBarPressable}]}>
                            { ({pressed}) => (
                                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                                    <CommunityIcon name={"attachment"} size={27} style={{padding: 3, paddingTop: 5, color: pressed ? addOpacityRGB("#585858", .7) : "#585858"}}/>
                                    <Text style={{color: pressed ? addOpacityRGB("#585858", .7) : "#585858"}}>Attachment</Text>
                                </View>
                            )}                        
                        </Pressable>
                    </View>
                    <View>
                        <Pressable onPress={onMentionPress} style={({pressed}) => [{backgroundColor: opacityOnPressed(pressed, "#E8E8E8"), ...styles.AccessoryBarPressable, width: 100}]}>
                            { ({pressed}) => (
                                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                                    <IonIcon name={"at"} size={27} style={{padding: 3, paddingTop: 5, color: pressed ? addOpacityRGB("#585858", .7) : "#585858"}}/>
                                    <Text style={{color: pressed ? addOpacityRGB("#585858", .7) : "#585858"}}>Mention</Text>
                                </View>
                            )}                        
                        </Pressable>
                    </View>
                </ScrollView>
            }
            { isAddItemViewOpen &&
                <ScrollView horizontal={true} style={{height: 70}} keyboardShouldPersistTaps={'always'}>
                    <View>
                        <Pressable onPress={() => setIsAddItemViewOpen(false)} style={({pressed}) => [{...styles.AccessoryBarPressable, borderRadius: 20, width: 35, paddingLeft: 0}]}>
                            { ({pressed}) => (
                                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                                    <CommunityIcon name={"close"} size={27} style={{borderRadius: 20, padding: 3,paddingTop: 5, color: pressed ? addOpacityRGB("#585858", .7) : "#585858"}}/>
                                </View>
                            )}                        
                        </Pressable>
                    </View>
                    <View>
                        <Pressable onPress={onAddTrainingItem} style={({pressed}) => [{backgroundColor: opacityOnPressed(pressed, "#E8E8E8"), ...styles.AccessoryBarPressable, width: 135}]}>
                            { ({pressed}) => (
                                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingLeft: 3}}>
                                    <IonIcon name={"barbell-sharp"} size={27} style={{padding: 3, paddingRight: 7, paddingTop: 5, color: pressed ? addOpacityRGB("#585858", .7) : "#585858"}}/>
                                    <Text style={{color: pressed ? addOpacityRGB("#585858", .7) : "#585858"}}>Training Item</Text>
                                </View>
                            )}                        
                        </Pressable>
                    </View>
                    <View>
                        <Pressable onPress={onInsertItemPress} style={({pressed}) => [{backgroundColor: opacityOnPressed(pressed, "#E8E8E8"), ...styles.AccessoryBarPressable, width: 105,}]}>
                            { ({pressed}) => (
                                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', height: 33}}>
                                    <CommunityIcon name={"book-edit-outline"} size={27} style={{padding: 3, paddingTop: 5, color: pressed ? addOpacityRGB("#585858", .7) : "#585858"}}/>
                                    <Text style={{color: pressed ? addOpacityRGB("#585858", .7) : "#585858"}}>Log Item</Text>
                                </View>
                            )}                        
                        </Pressable>
                    </View>
                    <View>
                        <Pressable onPress={onInsertItemPress} style={({pressed}) => [{backgroundColor: opacityOnPressed(pressed, "#E8E8E8"), ...styles.AccessoryBarPressable, width: 130}]}>
                            { ({pressed}) => (
                                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                                    <CommunityIcon name={"clipboard-check-outline"} size={27} style={{padding: 3, paddingTop: 5, color: pressed ? addOpacityRGB("#585858", .7) : "#585858"}}/>
                                    <Text style={{color: pressed ? addOpacityRGB("#585858", .7) : "#585858"}}>Check-In Item</Text>
                                </View>
                            )}                        
                        </Pressable>
                    </View>
                    <View>
                        <Pressable onPress={onInsertItemPress} style={({pressed}) => [{backgroundColor: opacityOnPressed(pressed, "#E8E8E8"), ...styles.AccessoryBarPressable, width: 140,}]}>
                            { ({pressed}) => (
                                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                                    <CommunityIcon name={"card-account-details-outline"} size={27} style={{padding: 3, paddingRight: 0, marginRight: 4, paddingTop: 5, color: pressed ? addOpacityRGB("#585858", .7) : "#585858"}}/>
                                    <Text style={{color: pressed ? addOpacityRGB("#585858", .7) : "#585858"}}>Measurements</Text>
                                </View>
                            )}                        
                        </Pressable>
                    </View>
                    <View>
                        <Pressable onPress={onInsertItemPress} style={({pressed}) => [{backgroundColor: opacityOnPressed(pressed, "#E8E8E8"), ...styles.AccessoryBarPressable, width: 80,}]}>
                            { ({pressed}) => (
                                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                                    <CommunityIcon name={"image"} size={27} style={{padding: 3, paddingRight: 0, paddingTop: 5, color: pressed ? addOpacityRGB("#585858", .7) : "#585858"}}/>
                                    <Text style={{color: pressed ? addOpacityRGB("#585858", .7) : "#585858"}}>Image</Text>
                                </View>
                            )}                        
                        </Pressable>
                    </View>
                </ScrollView>
            }
        </View>
    )
}


const styles = StyleSheet.create({
    AccessoryBarPressable: {
        borderRadius: 14,
        width: 120,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        margin: 5,
        height: 35,
        paddingLeft: 3,
        marginBottom: 0
    }
});


export { CreatePostScreen }