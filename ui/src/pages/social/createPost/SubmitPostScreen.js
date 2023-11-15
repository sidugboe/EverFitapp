import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { SubmitPostHeader } from '../../../components/appbars/SubmitPostHeader';
import { PressableButton } from '../../../components/generic/PressableButton';
import { pSBC } from '../../../utils/helpers/colorHelper';
import tags from '../../../utils/resources/PostTagValues'
import { usePosts } from '../../../services/postService';
import { LoadingModal } from '../../../components/modal/LoadingModal';
import { usePostTags } from '../../../services/usePostTags';
import { useWorkouts } from '../../../services/workoutService';
import { useRoutines } from '../../../services/routineService';
import { ConfirmationModal } from '../../../components/modal/ConfirmationModal';
import { useExercises } from '../../../services/exerciseService';

const subjectColors = [
    "#E3735E",
    "#89CFF0",
    "#C4B454"
]

const SubmitPostScreen = ({ navigation, route}) => {

    // navigation props
    const post = route.params.post;

    // component state
    const [selectedPostSubjects, setSelectedPostSubjects] = useState([]);
    const [subjectOptions, setSubjectOptions] = useState([]);
    const [showMaxSubjectsError, setShowMaxSubjectError] = useState("") // not true or false but string for the item it should show the error on (when they try to select it)
    const [response, setResponse] = useState("");
    const [isPosting, setIsPosting] = useState(false)
    const [isPrivateItemsModalOpen, setIsPrivateItemsModalOpen] = useState(false)

    // data hooks
    const { createPost } = usePosts();
    const { postTags } = usePostTags();
    const { setWorkoutAndChildrenToPublic } = useWorkouts();
    const { setRoutineToPublic } = useRoutines();
    const { setExerciseToPublic } = useExercises();

    // side effect to remove error message after 4 seconds
    useEffect(() => {
        if(showMaxSubjectsError)
            setTimeout(() => setShowMaxSubjectError(""), 1500);
    }, [showMaxSubjectsError])

    useEffect(() => {
        if(postTags.length){
            setSubjectOptions(postTags)
        }
    }, [postTags])

    // when success is updated
    useEffect(() => {
        if(response == "success")
            navigation.navigate("SocialHomePage", { success: true, message: "Post Successful"})
        else if(response == "failure")
            navigation.navigate("SocialHomePage", { success: false, message: "Something went wrong, post saved to drafts"})
    }, [response])

    const submitPost = async () => {
        // hide confirmation modal and set  loading to true to show loading modal
        setIsPosting(true);
        
        // set post items to public if they are private so that they can be accessed within the post
        setPostItemsToPublic();

        // apply tags to post
        let postWithTags = {...post, tags: selectedPostSubjects}

        // todo uncomment so post is created
        // create the post and update reponse state + remove loading spinner
        let isPostCreated = await createPost(postWithTags);
        setResponse(isPostCreated ? "success" : "failure");
        setIsPosting(false);
    }

    const onSubmitPost = () => {
        // open modal to tell user any private items will be set to public
        setIsPrivateItemsModalOpen(true)
    }

    const renderSubjectItem = (item, index) => {

        return (
            <Pressable onPress={() => onSubjectSelect(item)} style={({pressed}) => [{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',borderBottomWidth: 1, borderBottomColor: "lightgrey", padding: 8, backgroundColor: pressed ? '#E8E8E8' : undefined}]}>
                    <Text style={{fontSize: 20}}>{item}</Text>
                    <View>
                        { (showMaxSubjectsError && showMaxSubjectsError == item) &&
                            <Text style={{fontSize: 16, color: 'red'}}>Max subjects selected</Text>
                        }
                    </View>
            </Pressable>
        )
    }

    const onSubjectSelect = (subject) => {
        if(selectedPostSubjects.length > 2){
            setShowMaxSubjectError(subject);
        }
        else {
            setSelectedPostSubjects(prev => [...prev, subject])
            setSubjectOptions(prev => prev.filter(item => item != subject))
        }
    }

    const onSubjectRemove = (subject) => {
        setSelectedPostSubjects(prev => prev.filter((item, index) => item != subject))
        setSubjectOptions(prev => [...prev, subject])
    }

    const setPostItemsToPublic = () => {

        for(let item of post.items){
                if(item.type === "routine"){
                    
                    // set routine(s) to public along with any child workouts
                    for(let routine of item.routines){
                        
                        // note this function first fetch the routine then change to public if they are private
                        setRoutineToPublic(routine._id)

                        // set child workouts to public
                        for(let workout of routine.workoutTemplates){
                            setWorkoutAndChildrenToPublic(workout._id)
                        }
                    }
                }
                else if(item.type === "workout"){
                    for(let workout of item.workoutTemplates){
                        setWorkoutAndChildrenToPublic(workout._id)
                    }
                }
                else if(item.type === "exerciseTemplate"){
                    for(let exercise of item.exerciseTemplates){
                        setExerciseToPublic(exercise)
                    }
                }
                else if(item.type === "exerciseLog"){
                    // todo
                }
                else if(item.type === "workoutLog"){
                    // todo
                }
                else if(item.type === "checkInLog"){
                    // checkin log needs visibility
                }
            }
    }

    return (
        <View>
            <SubmitPostHeader navigation={navigation} onSubmit={onSubmitPost} canSubmit={selectedPostSubjects.length !== 0}/>
            <ConfirmationModal isVisible={isPrivateItemsModalOpen} onClose={() => setIsPrivateItemsModalOpen(false)} onConfirm={submitPost} titleText={"Confirm Post Create"} bodyText={"Any private training items or logs that you have added to the post will be set to public to be shown in the post.\nPress continue to proceed."} confirmButtonText={"Continue"} showCancelButton={true}/>
            <LoadingModal isVisible={isPosting} title={"Creating Post..."}/>
            { (selectedPostSubjects.length !== 0) &&
                <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', borderBottomColor: "#787878", borderBottomWidth: 1.5, paddingLeft: 7}}>
                    { selectedPostSubjects?.map((subject, index) => {

                        return (
                            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', borderRadius: 12, backgroundColor: subjectColors[index], marginRight: 8, marginBottom: 5}} key={"subject-" + index}>
                                <PressableButton name="close" size={18} onPress={() => onSubjectRemove(subject, index)}/>
                                <Text style={{fontSize: 15, marginRight: 10, color: pSBC(-.7, subjectColors[index])}}>{subject}</Text>
                            </View>
                        )
                    })}
                </View>
            }
            <View>
                <FlatList 
                    data={subjectOptions}
                    renderItem={(item, index) => renderSubjectItem(item.item, index)}
                    keyExtractor={item => item}
                />
            </View>
        </View>
    )
}

export { SubmitPostScreen };