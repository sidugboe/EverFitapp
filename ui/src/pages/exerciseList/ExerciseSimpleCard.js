import React, { useContext, useState, useEffect, useRef } from "react";
import { Text, TextInput, TouchableOpacity, View, Pressable } from 'react-native';
import { Box, AspectRatio, Image, Center, Heading, DeleteIcon, ChevronDownIcon, ChevronUpIcon, Stack, HStack} from 'native-base';
import { Button, Input, InputLeftAddon, InputGroup, InputRightAddon, Select, CheckIcon } from 'native-base';
import { useExerciseLogs } from "../../services/exerciseLogService";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const WEIGHT_UNITS = "lbs"

const ExerciseSimpleCard = ({exercise, navigation }) => {

    // when a card is pressed navigate to the corresponding screen
    const onCardPress = () => {
        navigation.navigate("Exercise", { exData: exercise});
    }

    return (
        <View style={{}}>
            <Box alignItems="center">
                <Pressable onPress={onCardPress} style={{overflow: 'hidden', borderRadius: 25, borderWidth: 1, borderColor: 'lightgrey', shadow: 3}}>
                    <Box w="80" rounded="lg" overflow="hidden" borderRadius="25" borderColor="coolGray.200" borderWidth="0" _dark={{
                    borderColor: "coolGray.600",
                    backgroundColor: "gray.700"
                    }} _light={{
                    backgroundColor: "gray.50"
                }}>
                        <Stack p="4" space={3}>
                            <Stack space={2}>
                                <View style={{display: 'flex', flexDirection: "row", alignItems: "center", justifyContent: 'space-between'}}>
                                    <Heading size="md" ml="-1" display="flex" flexWrap="wrap" marginLeft={1} flexDirection="row" width="75%">
                                    {exercise?.name}
                                    </Heading>
                                </View>
                                <Text fontSize="xs" _light={{
                                    color: "violet.500"
                                }} _dark={{
                                    color: "violet.400"
                                }} fontWeight="500" ml="-0.5" mt="-1">
                                    {exercise.muscleGroup}
                                </Text>
                            </Stack>
                            <Text fontWeight="400">
                                {exercise?.description}
                            </Text>
                            <HStack alignItems="center" space={4} justifyContent="space-between">
                                <HStack alignItems="center">
                                    <Text color="coolGray.600" _dark={{
                                    color: "warmGray.200"
                                }} fontWeight="400">
                                    {exercise?.sets?.length ? exercise?.sets?.length : "0"} sets
                                    </Text>
                                </HStack>
                            </HStack>
                        </Stack>
                    </Box>
                </Pressable>
            </Box>
        </View>
    );
}

export { ExerciseSimpleCard };