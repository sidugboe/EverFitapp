import React, { useState, useEffect } from "react";
import { Center, Button, View, Text, FlatList, Pressable, StyleSheet, ScrollView, Image } from 'react-native';
import { NewMessageHeader } from "../../../components/appbars/NewMessageHeader";
import { IconSearchBar } from "../../../components/generic/IconSearchBar";
import { ExplorePageHeader } from "../../../components/appbars/ExplorePageHeader";
import { usePostTags } from "../../../services/usePostTags";
import { opacityOnPressed } from "../../../utils/helpers/colorHelper";
import { useRoutines } from "../../../services/routineService";
import { useWorkouts } from "../../../services/workoutService";
import { useExercises } from "../../../services/exerciseService";
import { ExplorePageSkeleton } from '../../../components/skeletons/ExplorePageSkeleton'
import { useUserFunctions } from "../../../services/userServiceFunctions";

const DEFAULT_PROFILE_URL = "https://everfit-images.s3.us-east-2.amazonaws.com/photo.png"
const PROFILE_IMAGE_DIMENSIONS = 80;

const DEFUALT_EXPLORE_PAGE_ITEMS = {
    routines: [],
    wrokouts: [],
    exercises: [],
    users: [],
}

/**
 * Message List screen where user can see all of their message threads
 * @param {*} param0 
 * @returns 
 */
const ExplorePage = ({ navigation, route }) => {

    // hooks providing data to component
    const { searchUsersByUserName, fetchPopularUsers } = useUserFunctions()
    const { postTags, isLoading: isLoadingPostTags } = usePostTags();
    const { routines, isLoading: isLoadingRoutines, fetchPublicRoutines } = useRoutines();
    const { workouts, isLoading: isLoadingWorkouts, fetchPublicWorkouts } = useWorkouts();
    const { exercises, isLoading: isLoadingExercises, getPublicExercises } = useExercises();

    // component state
    const [userSearchResults, setUserSearchResults] = useState([]);
    const [isSearchApplied, setIsSearchApplied] = useState(false);
    const [isPageLoaded, setIsPageLoaded] = useState(false);
    const [explorePageItems, setExplorePageItems] = useState(DEFUALT_EXPLORE_PAGE_ITEMS);

    useEffect(() => {
        if(!isLoadingPostTags && !isLoadingRoutines && !isLoadingWorkouts && !isLoadingExercises)
            setIsPageLoaded(true)
    }, [isLoadingPostTags, isLoadingRoutines, isLoadingWorkouts, isLoadingExercises])

    useEffect(() => {
        const getPublicData = async () => {
            let publicExercisesPromise = getPublicExercises();
            // let publicRoutinesPromise = fetchPublicRoutines();
            let publicWorkoutsPromise = fetchPublicWorkouts();

            // get popular users
            let popularUsersPromise = fetchPopularUsers();
            
            // put promises into array of promises
            let promises = [/*publicRoutinesPromise,*/ publicWorkoutsPromise, publicExercisesPromise, popularUsersPromise];

            // wait for all promises to be complete before returning to previous screen
            let results = await Promise.allSettled(promises)
        
            // check if any promise were rejected)
            let success = true;
            for(let result of results){
                if(result.status == "rejected")
                    success = false;
            }

            if(!success){
                // do something
            }

            // apply results
            // NOTE THAT THESE RESULTS INDEXES NEED TO BE UPDATED ONCE PUBLIC ROUTINES ARE ADDED
            let items = {
                routines: [],
                workouts: results[0].value,
                exercises: results[1].value,
                users: results[2].value,
            }

            setExplorePageItems(items)
        }

        // todo implement when get public workouts and routines are also done
        getPublicData()
    }, [])

    const onSearchFieldChange = async (text) => {

        if(!text){
            setUserSearchResults([])
            return;
        }

        setIsSearchApplied(true)

        let userResults = await searchUsersByUserName(text);
        setUserSearchResults(userResults)
    }

    const renderSearchResult = (item) => {
        const isFirstItem = item.index == 0; // if its the first item top border radius needs to be rounded
        const isLastItem = item.index === userSearchResults.length - 1; // if its the last item bottom border radius needs to be rounded

        let user = item.item
        return (
            <Pressable onPress={() => onUserSearchResultPress(user)} style={({pressed}) => [{display: 'flex', flexDirection: 'row', alignItems: "center", borderColor: 'lightgrey', paddingLeft: 10, backgroundColor: pressed ? "#E0E0E0" : undefined}, isFirstItem ? styles.searchResultFirstItem : [], isLastItem ? styles.searchResultLastItem : [] ]}>
                <View style={{width: 20, height: 20, borderRadius: 40, borderWidth: 0.2, marginHorizontal: 5, overflow: "hidden"}}>
                    <Image source={{ uri: user?.profilePicURL ? user?.profilePicURL : DEFAULT_PROFILE_URL }} style={{ width: 20, height: 20}} />
                </View>
                <Text style={{fontSize: 18}}>{user?.name}</Text>
            </Pressable>
        )
    }

    const onUserSearchResultPress = (user) => {
        navigation.navigate("ViewProfile", {userId: user?._id})
    }

    const onTagPress = (tag) => {
        navigation.navigate("TagPosts", { tag: tag })
    }

    const onRoutinePress = (routine) => {
        // do something
    }

    const onExercisePress = (exercise) => {
        // do something
    }

    const onWorkoutPress = (workout) => {
        // do something
    }

    const onSearchCancelPress = () => {
        setIsSearchApplied(false)
    }

    const onUserPress = (user) => {
        navigation.navigate("ViewProfile", { userId: user?._id })
    }

    return (
        <View style={{display: 'flex', flexDirection: 'column'}}>
            <ExplorePageHeader navigation={navigation}/>
            <View style={{display: 'flex', flexDirection: 'column', paddingLeft: "5%"}}>

                {/* Explore Page Search Section - overlays explore page when user searches */}
                <IconSearchBar onChangeText={onSearchFieldChange}  name={"search-sharp"} color="rgb(150, 150, 170)" onCancel={onSearchCancelPress}/>
                { isSearchApplied ?
                    <>
                    { userSearchResults.length !== 0 ?
                        <View style={{ paddingTop: "3%", marginRight: '5%'}}>
                            <FlatList
                                style={{borderWidth: 1, ...styles.searchResultList}}
                                data={userSearchResults}
                                renderItem={(item) => renderSearchResult(item)}
                                keyExtractor={item => item?._id}
                                />
                        </View>
                        :
                        <View style={{marginTop: 10}}>
                            <Text style={{fontSize: 15, color: '#909090'}}>No matching results</Text>
                        </View>
                    }
                    </>
                :
                <>
                    { !isPageLoaded ? 
                        <ExplorePageSkeleton/>
                        :
                        <ScrollView style={{height: "84%"}} showsVerticalScrollIndicator={false}>
                            <View style={{display: 'flex', flexDirection: 'column', marginTop: 4}}>
                                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 15, marginBottom: 10, marginRight: "4%"}}>
                                    <Text style={{fontSize: 18, color: "rgb(150,150,150)"}}>Topics</Text>
                                    <Text style={{fontSize: 13, color: "rgb(150,150,150)"}}>View More</Text>
                                </View>
                                <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
                                    { postTags.slice(0, 13).map((tag, index) => {

                                        return (
                                            <Pressable onPress={() => onTagPress(tag)} style={({pressed}) => [{backgroundColor: opacityOnPressed(pressed, 'rgb(250,50,250)', .5), borderRadius: 5, marginRight: 4, marginBottom: 4}]} key={'explore-tag-' + tag}>
                                                <Text style={{color: 'white', margin: 3, marginHorizontal: 10, fontWeight: "bold"}}>{tag}</Text>
                                            </Pressable>
                                        )
                                    })

                                    }
                                </View>
                            </View>

                            {/* Explore Page Routines Section UPDATE ONCE PUBLIC ROUTINES ADDED */}
                            <View style={{display: 'flex', flexDirection: 'column', marginTop: 4}}>
                                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 15, marginBottom: 10, marginRight: "4%"}}>
                                    <Text style={{fontSize: 18, color: "rgb(150,150,150)"}}>Routines</Text>
                                    <Text style={{fontSize: 13, color: "rgb(150,150,150)"}}>View More</Text>
                                </View>
                                <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{display: 'flex', flexDirection: 'row'}}>
                                    { routines.slice(0, 13).map((routine, index) => {

                                        return (
                                            <Pressable onPress={onRoutinePress} style={({pressed}) => [{backgroundColor: opacityOnPressed(pressed, 'rgb(250,50,250)', .5), borderRadius: 5, marginRight: 4, marginBottom: 4, height: 60, width: 120, display: 'flex', justifyContent: 'space-around',flexDirection: 'row',alignItems: 'center'}]} key={'explore-routine-' + routine._id}>
                                                <Text style={{color: 'white', margin: 3, marginHorizontal: 10, fontWeight: "bold"}}>{routine.name}</Text>
                                            </Pressable>
                                        )
                                    })

                                    }
                                </ScrollView>
                            </View>

                            {/* Explore Page Workout Section */}
                            <View style={{display: 'flex', flexDirection: 'column', marginTop: 4}}>
                                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 15, marginBottom: 10, marginRight: "4%"}}>
                                    <Text style={{fontSize: 18, color: "rgb(150,150,150)"}}>Workouts</Text>
                                    <Text style={{fontSize: 13, color: "rgb(150,150,150)"}}>View More</Text>
                                </View>
                                <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{display: 'flex', flexDirection: 'row'}}>
                                    { explorePageItems.workouts?.slice(0, 13).map((workout, index) => {

                                        return (
                                            <Pressable onPress={onWorkoutPress} style={({pressed}) => [{backgroundColor: opacityOnPressed(pressed, 'rgb(250,50,250)', .5), borderRadius: 5, marginRight: 4, marginBottom: 4, height: 60, width: 120, display: 'flex', justifyContent: 'space-around',flexDirection: 'row',alignItems: 'center'}]} key={'explore-workout-' + workout._id}>
                                                <Text style={{color: 'white', margin: 3, marginHorizontal: 10, fontWeight: "bold"}}>{workout.name}</Text>
                                            </Pressable>
                                        )
                                    })

                                    }
                                </ScrollView>
                            </View>

                            {/* Explore Page Exercise Section */}
                            <View style={{display: 'flex', flexDirection: 'column', marginTop: 4}}>
                                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 15, marginBottom: 10, marginRight: "4%"}}>
                                    <Text style={{fontSize: 18, color: "rgb(150,150,150)"}}>Exercises</Text>
                                    <Text style={{fontSize: 13, color: "rgb(150,150,150)"}}>View More</Text>
                                </View>
                                <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{display: 'flex', flexDirection: 'row'}}>
                                    { explorePageItems.exercises?.slice(0, 13).map((exercise, index) => {

                                        return (
                                            <Pressable onPress={onExercisePress} style={({pressed}) => [{backgroundColor: opacityOnPressed(pressed, 'rgb(250,50,250)', .5), borderRadius: 5, marginRight: 4, marginBottom: 4, height: 60, width: 120, display: 'flex', justifyContent: 'space-around',flexDirection: 'row',alignItems: 'center'}]} key={'explore-exercise-' + exercise._id}>
                                                <Text style={{color: 'white', margin: 3, marginHorizontal: 10, fontWeight: "bold"}}>{exercise.name}</Text>
                                            </Pressable>
                                        )
                                    })

                                    }
                                </ScrollView>
                            </View>

                            {/* Explore Page Users Section - removed until getTopUsers route added */}
                            <View style={{display: 'flex', flexDirection: 'column', marginTop: 4}}>
                                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 15, marginBottom: 10, marginRight: "4%"}}>
                                    <Text style={{fontSize: 18, color: "rgb(150,150,150)"}}>Recommended Users</Text>
                                    <Text style={{fontSize: 13, color: "rgb(150,150,150)"}}>View More</Text>
                                </View>
                                <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{display: 'flex', flexDirection: 'row'}}>
                                    { explorePageItems.users?.slice(0, 13).map((user, index) => {

                                        return (
                                            <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 20}} key={"epxlore-page-user" + index}>
                                                <Pressable onPress={() => onUserPress(user)} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                                    {({pressed, color="#202020"}) => (
                                                        <View style={styles.userProfileImageView}>
                                                            <Image source={{ uri: user?.profilePicURL ? user?.profilePicURL : DEFAULT_PROFILE_URL }} style={{ width: PROFILE_IMAGE_DIMENSIONS, height: PROFILE_IMAGE_DIMENSIONS}} />
                                                        </View>
                                                    )}
                                                </Pressable>
                                                <Text style={{fontSize: 16}}>{user.name}</Text>
                                            </View>
                                        )
                                    })}
                                </ScrollView>
                            </View>
                    </ScrollView>
                    }</>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    searchResultList: {
        borderRadius: 8,
        borderColor: '#989898'
    },
    searchResultFirstItem: {
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8
    },
    searchResultLastItem: {
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8
    },
    userProfileImageView: {
        height: PROFILE_IMAGE_DIMENSIONS, 
        width: PROFILE_IMAGE_DIMENSIONS, 
        borderRadius: 200, 
        borderColor: 'grey', 
        borderWidth: 1, 
        overflow: 'hidden'
    }
});

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


export { ExplorePage };