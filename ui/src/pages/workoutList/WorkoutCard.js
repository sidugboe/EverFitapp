import React from "react";
import { Text, ImageBackground } from 'react-native';
import { Box, HStack, Stack, Heading, Pressable } from 'native-base';

/**
 * WorkoutCard component is used to display a single Workout within the users workouts list
 * These WorkoutCard objects appear in the workout list found in the WorkoutScreen component
 * @param {} param0 
 * @returns 
 */
const WorkoutCard = ({workout, navigation, onCardPress}) => {

    return (
        <Box alignItems="center">
          <Pressable onPress={onCardPress} rounded="25" overflow="hidden" borderWidth="1" borderColor="coolGray.300" maxW="96" shadow="3" bg="coolGray.100">
          <Box w="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="0" _dark={{
          borderColor: "coolGray.600",
          backgroundColor: "gray.700"
        }} _light={{
          backgroundColor: "gray.50"
        }}>
            <ImageBackground source={{ uri: workout.attachments?.[0] }}>
                <Stack p="4" space={3}>
                <Stack space={2}>
                    <Heading size="md" ml="-1" color={workout.textColor}>
                    {workout?.name}
                    </Heading>
                </Stack>
                <Text fontWeight="400" style={{color: workout.textColor}}>
                {workout?.description}
                </Text>
                <HStack alignItems="center" space={4} justifyContent="space-between">
                    <HStack alignItems="center">
                    <Text style={{color: workout.textColor}} fontWeight="400">
                        {workout?.exerciseTemplates?.length && (workout?.exerciseTemplates?.length + " exercises")}
                    </Text>
                    </HStack>
                </HStack>
                </Stack>
            </ImageBackground>
          </Box>
          </Pressable>
      </Box>
    );
}

export { WorkoutCard };