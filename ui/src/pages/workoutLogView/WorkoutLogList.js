import React, { useContext, useState, useEffect, useRef } from "react";
import { useExercises } from '../../services/exerciseService';
import { Text, TouchableOpacit, View } from 'react-native';
import { Box, VStack, Divider, HStack, AspectRatio, Image, Center, Stack, Heading, Pressable, DeleteIcon, ChevronDownIcon, ChevronUpIcon } from 'native-base';
import { Button, ArrowBackIcon, Input, InputLeftAddon, InputGroup, InputRightAddon, Select, CheckIcon } from 'native-base';
import { useExerciseSets } from "../../services/exerciseSetService";
import { useExerciseSetLogs } from "../../services/exerciseSetLogService";
import { useWorkouts } from "../../services/workoutService";
import { useWorkoutLogs } from "../../services/workoutLogService";
import { useExerciseLogs } from "../../services/exerciseLogService";

const WEIGHT_UNITS = "lbs"

const WorkoutLogList = ({exercise, navigation, isEditMode, onDelete, onMoveDown, onMoveUp, isWorkoutInProgress, exerciseInProgress, setExerciseInProgress, setExerciseLogs }) => {
    
    // hooks 
    const { workouts } = useWorkouts();
    const { workoutLogs} = useWorkoutLogs();

    const { } = useExercises();
    const { } = useExerciseLogs();

    return (
        <View>
        </View>
    );
};

