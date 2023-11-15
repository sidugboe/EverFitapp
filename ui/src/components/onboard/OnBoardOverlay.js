import React, { useContext, useState, useEffect, useRef } from "react";
import { Button, ArrowBackIcon, Input, InputLeftAddon, InputGroup, InputRightAddon, Select, CheckIcon } from 'native-base';
import { Text, TextInput, TouchableOpacity, View, Modal, StyleSheet, Pressable, Keyboard } from 'react-native';
import { useExerciseSets } from "../../services/exerciseSetService";
import { useExerciseSetLogs } from "../../services/exerciseSetLogService";
import styles from "../../stylesheet";

const WEIGHT_UNITS = "lbs"

const OnBoardOverlay = () => {

    return (
        <>
        </>
    )
}

export { OnBoardOverlay };