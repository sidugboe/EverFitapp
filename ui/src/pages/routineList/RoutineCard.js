import React from "react";
import { Text, ImageBackground, View } from 'react-native';
import { Box, Stack, Heading, Pressable } from 'native-base';

/**
 * RoutineCard component to represent a single routine generated for a Routine object belonging to the user.
 * These RoutineCard objects appear in the routine list found in the RoutineScreen component
 * @param {} param0 
 * @returns 
 */
const RoutineCard = ({routine, navigation}) => {

    // when a card is pressed navigate to the corresponding screen
    const onCardPress = () => {
      navigation.navigate("Workouts", { routineData: routine });
    }

    return (
        <Box alignItems="center" marginTop="3">
            <Pressable onPress={onCardPress} rounded="25" overflow="hidden" borderWidth="1" borderColor="coolGray.300" maxW="96" shadow="3" bg="coolGray.100">
            <Box w="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="0" _dark={{
            borderColor: "coolGray.600",
            backgroundColor: "gray.700"
            }} _light={{
            backgroundColor: "gray.50"
            }}>
                <ImageBackground source={{ uri: routine.attachments?.[0] }}>
                    <Stack p="4" space={3}>
                    <Stack space={2}>
                        <Heading size="md" ml="-1" color={routine.textColor}>
                        {routine?.name}
                        </Heading>
                    </Stack>
                    <Text fontWeight="400" style={{color: routine.textColor}}>
                        {routine?.description}
                    </Text>
                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <Text fontWeight="400" style={{color: routine.textColor}}>
                                {routine?.workoutTemplates?.length && (routine?.workoutTemplates?.length + " days")}
                        </Text>
                        <Text style={{fontSize: 20, paddingHorizontal: 8, color: routine.textColor}}>
                            {'•'}
                        </Text>
                        <Text fontWeight="400" style={{color: routine.textColor}}>
                                {"Creator Name" /*routine?.creatorId?.name*/}
                        </Text>
                    </View>
                    </Stack>
                </ImageBackground>
            </Box>
            </Pressable>
        </Box>
    );
}

export { RoutineCard };