import React, { useState, useEffect, useRef } from "react";
import { Feed } from "../social/Feed";
import { RoutineList } from "../routineList/RoutineList";
import { WorkoutList } from "../workoutList/WorkoutList";
import { ExerciseList } from "../exerciseList/ExerciseList";

/**
 * View profile screen that renders a user's profile
 * @param {*} param0 
 * @returns 
 */
const ProfileBody = ({ selectedType, navigation, userPosts, userRoutines, userWorkouts, userExercises, isOwnProfile }) => {
    
    if(selectedType === "posts"){
        return <Feed posts={userPosts} navigation={navigation}/>
    }
    else if(selectedType == "routines"){
        return <RoutineList navigation={navigation} routines={userRoutines} belongsToUser={isOwnProfile}/>
    }
    else if(selectedType == "workouts"){
        return <WorkoutList navigation={navigation} workouts={userWorkouts} belongsToUser={isOwnProfile}/>
    }
    else if(selectedType == "exercises"){
        return <ExerciseList exercises={userExercises} navigation={navigation} belongsToUser={isOwnProfile} />
    }
    else if(selectedType == "logs"){

    }
    else {
        return <></>
    }
}

export { ProfileBody }