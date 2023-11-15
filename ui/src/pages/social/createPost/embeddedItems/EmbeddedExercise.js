import React, { useState } from "react";
import { View, Text, Pressable } from 'react-native';
import { default as CommunityIcon } from 'react-native-vector-icons/MaterialCommunityIcons';
import { EmbeddedItemEditControls } from "./EmbeddedItemEditControls";
import { pSBC } from "../../../../utils/helpers/colorHelper";

const NESTING_BACKGROUND_COLORS = {
    0: "#D3D3D3",
    1: "#C8C8C8",
    2: "#F0F0F0",
    3: "#E0E0E0", // max nesting would be 3 being: group (0) > routine (1) > workout (2) > exercise (3)
    4: "#F8F8F8",
}

// unsure of which style to choose out of the two, flicker on press/hold or not (no flicker looks better but doesn't indicate hold to edit)
const STYLE_MODE = 1

const EmbeddedExercise = ({ item, onDelete, creator, isNested = 0 }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)

    const exerciseHasSets = item?.sets?.length != 0
    const descriptionStringMaxLength = isNested ? 15 : 20;

    const onPress = () => {
        if(exerciseHasSets){
            setIsExpanded(prev => !prev)
            setIsEditMode(false) 
        }       
    }

    const onLongPress = () => {
        setIsEditMode(true)
    }

    const renderChildSets = () => {
        if(exerciseHasSets)
            return (
                <View style={{display: 'flex', flexDirection: 'column', maxWidth: "95%", minWidth: "95%", marginLeft: 5}}>
                    { item.sets?.map((set, index) => {

                            return (
                                <View style={{display: 'flex', flexDirection: "column", alignItems: "flex-start"}} key={item._id + "-set-" + index}>
                                    <Text style={{fontWeight: "bold", fontSize: 17}}>{set?.type + " set"}</Text>
                                    <Text style={{paddingVertical: 2}}>{set.comments ? set.comments : "no comments"}</Text>
                                </View>
                            );
                        })
                    }
                </View> 
            )
    }

    return (
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
            <View style={{display: 'flex', flexDirection: 'column', marginBottom: isNested ? 8 : 0, width: "98%"}}>
                <Text style={{fontSize: 14, marginLeft: 4, fontWeight: "bold", marginTop: isNested ? 5 : 0}}>Exercise: {item.name}</Text>
                <View style={{display: 'flex', flexDirection: 'column'}}>
                    <View style={{display: 'flex', flexDirection: 'column', alignItems: "center", backgroundColor: NESTING_BACKGROUND_COLORS[isNested], borderRadius: 10}}>
                        <Pressable onLongPress={!isNested ? onLongPress : undefined} onPress={onPress} style={({pressed}) => STYLE_MODE == 1 ? [{ display: 'flex', flexDirection: 'column', width: "95%"}] : [{ display: 'flex', flexDirection: 'column', width: "100%", borderRadius: 10, paddingHorizontal: "2.5%", backgroundColor: (pressed && !isExpanded) ? pSBC(.7, NESTING_BACKGROUND_COLORS[isNested]) : undefined}]}>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 5, paddingTop: 1}}>
                                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingTop: 2, width: "80%"}}>
                                    <CommunityIcon size={50} name="format-list-numbered" />
                                    <View style={{display: 'flex', flexDirection: "column", justifyContent: 'flex-start', marginHorizontal: 7}}>
                                        { exerciseHasSets != 0 ?
                                            <Text>{item?.sets?.length + " sets"}</Text>
                                            :
                                            <Text>{"no sets"}</Text>
                                        }
                                        <Text style={{ fontSize: 11, fontStyle: 'italic'}}>{"created by " + creator?.name}</Text>
                                    </View>
                                </View>
                                { exerciseHasSets &&
                                    <CommunityIcon name={isExpanded ? "chevron-down" : "chevron-right"} color={exerciseHasSets ? "black" : "lightgreen"} size={35} style={{marginRight: 10}}/>
                                }
                            </View>
                        </Pressable>
                        { isExpanded &&
                            <View style={{width: "100%", display: "flex", flexDirection: 'row', justifyContent: 'space-around'}}>
                                <View  style={{ backgroundColor: NESTING_BACKGROUND_COLORS[isNested + 1], borderRadius: 10, display: 'flex', flexDirection: 'column', margin: 7}}>
                                    {renderChildSets()}
                                </View>
                            </View>
                        }
                    </View>
                    { isEditMode &&
                        <EmbeddedItemEditControls isVisible={isEditMode} setIsVisible={setIsEditMode} onDelete={onDelete}/>
                    }
                </View>
            </View>
        </View>
    );
}

export { EmbeddedExercise };