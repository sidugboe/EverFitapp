import React, { useState, useEffect, useRef } from "react";
import { View, Text, Pressable } from 'react-native';
import { default as CommunityIcon } from 'react-native-vector-icons/MaterialCommunityIcons';
import { EmbeddedExercise } from "./EmbeddedExercise";
import { EmbeddedItemEditControls } from "./EmbeddedItemEditControls";
import { pSBC } from "../../../../utils/helpers/colorHelper";
import { useUserFunctions } from "../../../../services/userServiceFunctions";
import { useAuth } from "../../../../services/authService";
import { useExerciseFunctions } from "../../../../services/exerciseServiceFunctions";

const NESTING_BACKGROUND_COLORS = {
    0: "#D3D3D3",
    1: "#C8C8C8",
    2: "#FFFFFF",
    3: "#DCDCDC" // max nesting would be 3 being: group (0) > routine (1) > workout (2) > exercise (3)
}

// unsure of which style to choose out of the two, flicker on press/hold or not (no flicker looks better but doesn't indicate hold to edit)
const STYLE_MODE = 1

const EmbeddedWorkout = ({ item, onDelete, creator, isNested = 0 }) => {

    // component state
    const [isExpanded, setIsExpanded] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false);
    const [childExerciseCreators, setChildExerciseCreators] = useState([]) // array of creator objects
    const [childExercises, setChildExercises] = useState([]); // child exercises to the item. This will have a value if this Embedded workout exists within the CreatePostScreen as child exercise objects are not populated from ther TrainingLibrary. However if this exists within the PostScreen (view post) then it will not exist as child items are all autopopulated

    const itemHasExercises = item?.exerciseTemplates?.length != 0
    const descriptionStringMaxLength = isNested ? 15 : 20;

    const { user: currentUser } = useAuth();
    const { fetchItemCreators } = useUserFunctions();
    const { getExercisesById } = useExerciseFunctions();

    // fetch users for child exercises if they are not auto populated
    useEffect(() => {
        const fetchChildExerciseCreators = async () => {
            let itemToCreatorMap = await fetchItemCreators(item?.exerciseTemplates, currentUser)
            setChildExerciseCreators(itemToCreatorMap)
        }

        /**
         * Fetches child exercises from an array of exercise ids. Note this is only necessary for embedded items in CreatePostScreen NOT view post (PostScreen). Child items are all auto populated in post but NOT from the TraingingLibrary. So we need to populate child exercises if they are only ids.
         */
        const fetchChildExercsies = async () => {
            let childExercisePromises = getExercisesById(item?.exerciseTemplates)

            // await for all promises to be fullfilled 
            let results = await Promise.allSettled(childExercisePromises)
            setChildExercises(results.map(result => result.value))

            // now no need to fetch exercise creators though because auto populated when you fetch exercises individually
        }

        if(item?.exerciseTemplates?.length){

            // fetch child exercise object if they are an array of ids rather than hhaving been populated already (if we are in the CreatePostScren screen rather than PostScreen)
            if(!item?.exerciseTemplates[0]._id){
                fetchChildExercsies()
            }
            else if(!item?.exerciseTemplates[0]?.creatorId?.name){ // check that the creators haven't been auto populated already
                fetchChildExerciseCreators();
            }
        }
    }, [item?.exerciseTemplates?.length])

    const onPress = () => {
        setIsExpanded(prev => !prev)
        setIsEditMode(false)
    }

    const renderChildItems = () => {

        // render the exercises - whether auto populated from the post item or fetched on initial render (depending on if this EmbeddedWorkout is rendered from TrainingLibrary data or Post data)
        let exercises = childExercises.length ? childExercises : item?.exerciseTemplates

        if(itemHasExercises){
            return exercises.map((item, index) => {
                let exerciseCreator = childExercises.length ? item.creatorId : childExerciseCreators[item._id];

                return (
                    <EmbeddedExercise item={item} creator={exerciseCreator} isNested={isNested + 1} key={"embedded-exercise-l2-" + item._id}/>
                )
            })
        }
    }

    const onLongPress = () => {
        setIsEditMode(true)
    }

    return (
        <View style={{display: 'flex', flexDirection: 'column'}}>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                <View style={{display: 'flex', flexDirection: 'column', marginBottom: isNested ? 10 : 0, width: "98%"}}>
                    <Text style={{fontSize: 14, marginLeft: 4, fontWeight: "bold"}}>Workout: {item.name}</Text>
                    <View style={{display: 'flex', flexDirection: 'column', alignItems: "center", borderRadius: 10, backgroundColor: NESTING_BACKGROUND_COLORS[isNested]}}>
                        <Pressable onPress={onPress} onLongPress={!isNested ? onLongPress : undefined} style={({pressed}) => STYLE_MODE == 1 ? [{ display: 'flex', flexDirection: 'column', width: "95%"}] : [{ borderRadius: 10, display: 'flex', flexDirection: 'column', width: "100%", backgroundColor: (pressed && !isExpanded) ? pSBC(.7, NESTING_BACKGROUND_COLORS[isNested]) : undefined, paddingHorizontal: "2.5%"}]}>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 5, paddingTop: 2, width: "80%"}}>
                                    <CommunityIcon size={50} name="format-list-text" style={{marginRight: 5}}/>
                                        <View style={{display: 'flex', flexDirection: "column", justifyContent: 'flex-start', marginHorizontal: 3, maxWidth: "60%"}}>
                                            { itemHasExercises ?
                                                <Text>{item?.exerciseTemplates?.length + " exercises"}</Text>
                                                :
                                                <Text>{"no exercises"}</Text>
                                            }
                                            <Text style={{ fontSize: 11, fontStyle: 'italic'}}>{"created by " + creator?.name}</Text>
                                        </View>
                                </View>
                                { (itemHasExercises && !isEditMode) &&
                                    <View style={{width: 40}}>
                                        <CommunityIcon name={isExpanded ? "chevron-down" : "chevron-right"} color={"black"} size={35}/>
                                    </View>
                                }
                            </View>
                        </Pressable>
                        { isExpanded &&
                            <View  style={{ borderRadius: 10, display: 'flex', flexDirection: 'column', maxWidth: "90%"}}>
                                {renderChildItems()}
                            </View>
                        }
                    </View>
                </View>
            </View>
            <EmbeddedItemEditControls isVisible={isEditMode} setIsVisible={setIsEditMode} onDelete={onDelete}/>
        </View>
    );
}

// polyfill issues with promise.allSettles becuase verioning
Promise.allSettled = Promise.allSettled || ((promises) => Promise.all(
    promises.map(p => p
        .then(value => ({
            status: "fulfilled",
            value
        }))
        .catch(reason => ({
            status: "rejected",
            reason
        }))
    )
));

export { EmbeddedWorkout };