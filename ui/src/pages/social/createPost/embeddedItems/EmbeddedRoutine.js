import React, { useState, useEffect, useRef } from "react";
import { View, Text, Pressable } from 'react-native';
import { default as CommunityIcon } from 'react-native-vector-icons/MaterialCommunityIcons';
import { EmbeddedItemEditControls } from "./EmbeddedItemEditControls";
import { pSBC } from "../../../../utils/helpers/colorHelper";
import { EmbeddedWorkout } from "./EmbeddedWorkout";
import { useUserFunctions } from "../../../../services/userServiceFunctions";
import { useAuth } from "../../../../services/authService";

const NESTING_BACKGROUND_COLORS = {
    0: "#D3D3D3",
    1: "#C8C8C8",
    2: "#F0F0F0",
    3: "#E0E0E0", // max nesting would be 3 being: group (0) > routine (1) > workout (2) > exercise (3)
    4: "#F8F8F8",
}

// unsure of which style to choose out of the two, flicker on press/hold or not (no flicker looks better but doesn't indicate hold to edit)
const STYLE_MODE = 1

const EmbeddedRoutine = ({ item, onDelete, creator, isNested = 0 }) => {

    // component state
    const [isExpanded, setIsExpanded] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [childWorkoutCreators, setChildWorkoutCreators] = useState({})

    // hook to acess workout data
    const { fetchItemCreators } = useUserFunctions();
    const { user } = useAuth();

    const routineHasWorkouts = item?.workoutTemplates?.length != 0
    const descriptionStringMaxLength = isNested ? 15 : 20;

    // fetches all the child workout's exercises because routine doesn't auto populate these
    useEffect(() => {
        const fetchChildWorkoutCreators = async () => {
            let itemToCreatorMap = await fetchItemCreators(item?.workoutTemplates, user)
            setChildWorkoutCreators(itemToCreatorMap)
        }

        if(routineHasWorkouts){
            if(!item?.workoutTemplates[0].creatorId?.name)  // first check that the creators were not auto populatred (in case this is ever changed)
                fetchChildWorkoutCreators();
        }
    }, [item])

    const onPress = () => {
        setIsExpanded(prev => !prev)
        setIsEditMode(false)
    }

    const renderChildItems = () => {
        if(routineHasWorkouts){
            return item?.workoutTemplates?.map((item, index) => {

                return (
                    <EmbeddedWorkout item={item} isNested={isNested + 1} key={item?._id + "-index"} creator={childWorkoutCreators[item._id]}/>
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
                    <Text style={{fontSize: 14, marginLeft: 4, fontWeight: "bold"}}>Routine: {item.name}</Text>
                    <View style={{display: 'flex', flexDirection: 'column', alignItems: "center", borderRadius: 10, backgroundColor: NESTING_BACKGROUND_COLORS[isNested]}}>
                        <Pressable onPress={onPress} onLongPress={!isNested ? onLongPress : undefined} style={({pressed}) => STYLE_MODE == 1 ? [{ display: 'flex', flexDirection: 'column', width: "95%"}] : [{ borderRadius: 10, display: 'flex', flexDirection: 'column', width: "100%", backgroundColor: (pressed && !isExpanded) ? pSBC(.7, NESTING_BACKGROUND_COLORS[isNested]) : undefined, paddingHorizontal: "2.5%"}]}>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 5, paddingTop: 2, width: "80%"}}>
                                    <CommunityIcon size={50} name="format-list-group" style={{marginRight: 5}}/>
                                        <View style={{display: 'flex', flexDirection: "column", justifyContent: 'flex-start', marginHorizontal: 3, maxWidth: "60%"}}>
                                            { routineHasWorkouts ?
                                                <Text>{item?.workoutTemplates?.length + " workouts"}</Text>
                                                :
                                                <Text>{"no workouts"}</Text>
                                            }
                                            <Text style={{ fontSize: 11, fontStyle: 'italic'}}>{"created by " + creator?.name}</Text>
                                        </View>
                                </View>
                                { (routineHasWorkouts && !isEditMode) &&
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

export { EmbeddedRoutine };