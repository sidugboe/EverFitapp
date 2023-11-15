import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from 'react-native';
import { default as EvilIcon } from 'react-native-vector-icons/EvilIcons'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { RoutineScreen } from '../../pages/routineList/RoutineScreen';
import DetailedExerciseView from '../../pages/exerciseList/ExerciseFullView/DetailedExerciseView'
import { WorkoutScreen } from '../../pages/workoutList/WorkoutScreen';
import { ExerciseScreen } from '../../pages/exerciseList/ExerciseScreen';
import { TrainingHomePage } from '../../pages/trainingHome/TrainingHomePage';
import { SocialHomePage } from '../../pages/social/SocialHomePage';
import { PostScreen } from '../../pages/social/viewPost/PostScreen';
import { WorkoutLogScreen } from '../../pages/workoutLogList/WorkoutLogScreen';
import { ExerciseLogScreen } from '../../pages/workoutLogList/ExerciseLogScreen';
import { CreatePostScreen } from '../../pages/social/createPost/CreatePostScreen';
import { SubmitPostScreen } from '../../pages/social/createPost/SubmitPostScreen';
import { AlertsScreen } from '../../pages/social/alerts/AlertsScreen';
import { MessageList } from '../../pages/social/messages/MessageList';
import { NewMessage } from '../../pages/social/messages/NewMessage';
import { ExplorePage } from '../../pages/social/explore/ExplorePage';
import { Followers } from '../../pages/profile/Followers';
import { Following } from '../../pages/profile/Following';
import RoutineCreator from '../../pages/routineEditor/RoutineCreator';
import WorkoutCreator from '../../pages/WorkoutEditor/WorkoutCreator';
import ExerciseCreator from '../../pages/ExerciseEditor/ExerciseCreator';
import { AnalyticsPage } from '../../pages/Analytics/AnalyticsPage';
import ProfileDummy from '../../pages/profile/ProfileDummy';
import { EditProfileScreen } from '../../pages/profile/editProfile/EditProfileScreen';

import RoutineEditor from '../../pages/routineEditor/RoutineEditor';
import WorkoutEditor from '../../pages/WorkoutEditor/WorkoutEditor';
import ExerciseEditor from '../../pages/ExerciseEditor/ExerciseEditor';
import { ViewProfile } from '../../pages/profile/ViewProfile';
import { SettingsScreen } from '../../pages/settings/SettingsScreen';
import { TopicPosts } from '../../pages/social/explorePosts/TopicPosts';

const SignedInStack = (props) => {
    const Stack = createNativeStackNavigator();
    const Tab = createBottomTabNavigator();

    let RoutineStackNavigator = () => {
        return (
            <>
                <Stack.Navigator initialRouteName="RoutineStack" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="TrainingHome" component={TrainingHomePage} options={{ headerShown: false }} initialParams={{}} />
                    <Stack.Screen name="Routines" component={RoutineScreen} options={{ headerShown: false }} initialParams={{}} />
                    <Stack.Screen name="Workouts" component={WorkoutScreen} options={{ headerShown: false }} initialParams={{}} />
                    <Stack.Screen name="Exercises" component={ExerciseScreen} options={{ headerShown: false }} initialParams={{}} />
                    <Stack.Screen name="Exercise" component={DetailedExerciseView} options={{ headerShown: false }} initialParams={{}} />

                    <Stack.Screen name="AddRoutine" component={RoutineCreator} options={{ headerShown: false }} initialParams={{}} />
                    <Stack.Screen name="AddWorkout" component={WorkoutCreator} options={{ headerShown: false }} initialParams={{}} />
                    <Stack.Screen name="AddExercise" component={ExerciseCreator} options={{ headerShown: false }} initialParams={{}} />

                    <Stack.Screen name="EditRoutine" component={RoutineEditor} options={{ headerShown: false }} initialParams={{}} />
                    <Stack.Screen name="EditWorkout" component={WorkoutEditor} options={{ headerShown: false }} initialParams={{}} /> 
                    <Stack.Screen name="EditExercise" component={ExerciseEditor} options={{ headerShown: false }} initialParams={{}} />

                    <Stack.Screen name="WorkoutLogs" component={WorkoutLogScreen} options={{ headerShown: false }} initialParams={{}} />
                    <Stack.Screen name="WorkoutLogExercises" component={ExerciseLogScreen} options={{ headerShown: false }} initialParams={{}} />

                    <Stack.Screen name="Analytics" component={AnalyticsPage} options={{ headerShown: false }} initialParams={{}} />
                </Stack.Navigator>
            </>
        );
    }

    let ProfileStackNavigator = () => {
        return (
            <>
                <Stack.Navigator initialRouteName="ProfileStack" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="UserProfile" component={ViewProfile} options={{ headerShown: false }} initialParams={{ isUsersOwnProfile: true }}  />
                    <Stack.Screen name="ViewProfile" component={ViewProfile} options={{ headerShown: false }} initialParams={{}} />
                    <Stack.Screen name="Following" component={Following} options={{ headerShown: false }} initialParams={{}} />
                    <Stack.Screen name="Followers" component={Followers} options={{ headerShown: false }} initialParams={{}} />
                    <Stack.Screen name="ProfilePage" component={ProfileDummy} options={{ headerShown: false }} initialParams={{}} />
                    <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} initialParams={{}} />
                    <Stack.Screen name="Post" component={PostScreen} options={{ headerShown: false }} initialParams={{}} />
                    <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }} initialParams={{}} />
                    <Stack.Screen name="Workouts" component={WorkoutScreen} options={{ headerShown: false }} initialParams={{}} />
                    <Stack.Screen name="Exercises" component={ExerciseScreen} options={{ headerShown: false }} initialParams={{}} />
                </Stack.Navigator>
            </>
        );
    }

    let SocialStackNavigator = () => {
        return (
            <>
                <Stack.Navigator initialRouteName="SocialStack" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="SocialHomePage" component={SocialHomePage} options={{ headerShown: false }} initialParams={{}} />
                    <Stack.Screen name="Post" component={PostScreen} options={{ headerShown: false }} initialParams={{}} />
                    <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{ headerShown: false }} initialParams={{}} />
                    <Stack.Screen name="SubmitPost" component={SubmitPostScreen} options={{ headerShown: false }} initialParams={{}} />
                    <Stack.Screen name="Explore" component={ExplorePage} options={{ headerShown: false }} initialParams={{}} />
                    <Stack.Screen name="ViewProfile" component={ViewProfile} options={{ headerShown: false }} initialParams={{}} />
                    <Stack.Screen name="Following" component={Following} options={{ headerShown: false }} initialParams={{}} />
                    <Stack.Screen name="Followers" component={Followers} options={{ headerShown: false }} initialParams={{}} />
                    <Stack.Screen name="TagPosts" component={TopicPosts} options={{ headerShown: false }} initialParams={{}} />
                    <Stack.Screen name="Workouts" component={WorkoutScreen} options={{ headerShown: false }} initialParams={{}} />
                </Stack.Navigator>
            </>
        );
    }

    let AlertStackNavigator = () => {
        return (
            <>
                <Stack.Navigator initialRouteName="AlertsStack" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="AlertsPage" component={AlertsScreen} options={{ headerShown: false }} initialParams={{}} />
                    <Stack.Screen name="Messages" component={MessageList} options={{ headerShown: false }} initialParams={{}} />
                    <Stack.Screen name="NewMessage" component={NewMessage} options={{ headerShown: false }} initialParams={{}} />
                </Stack.Navigator>
            </>
        )
    }
    
    let HomeStackNavigator = () => {

        return (
            <Tab.Navigator initialRouteName="SignedInStack" screenOptions={{ headerShown: false, lazy: false, tabBarLabelStyle: { fontFamily: 'Montserrat_Regular' }, tabBarHideOnKeyboard: true }}>
                <Tab.Screen name="Training" component={RoutineStackNavigator} options={{
                    title: 'Training',
                    tabBarIcon: () => <Icon name="weight-lifter" size={30}/>,
                    tabBarLabel: ({ focused, color, }) => {
                        return (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                <Text style={{color: color}}>Training</Text>
                            </View>
                        );
                    },
                }}
                />
                <Tab.Screen name="Social" component={SocialStackNavigator} options={{
                    title: 'Social',
                    tabBarIcon: () => <Icon name="home-variant" size={30}/>,
                    tabBarLabel: ({ focused, color, }) => {
                        return (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                <Text style={{color: color}}>Social</Text>
                            </View>
                        );
                    },
                }}
                />
                <Tab.Screen name="Alerts" component={AlertStackNavigator} options={{
                    title: 'Alerts',
                    tabBarIcon: () => <EvilIcon name="bell" size={30}/>,
                    tabBarLabel: ({ focused, color, }) => {
                        return (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                <Text style={{color: color}}>Alerts</Text>
                            </View>
                        );
                    },
                }}
                />
                <Tab.Screen name="Profile" component={ProfileStackNavigator} options={{
                    title: 'Profile',
                    tabBarIcon: () => <EvilIcon name="user" size={30}/>,
                    tabBarLabel: ({ focused, color, }) => {
                        return (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                <Text style={{color: color}}>Profile</Text>
                            </View>
                        );
                    },
                }}
                />
            </Tab.Navigator>
        );
    }

    return (
        <HomeStackNavigator/>
    );
};

export default SignedInStack;