import React, { useState , useRef , useEffect} from "react";
import { Center, Box, Text, HStack , VStack, ScrollView } from "native-base";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import { AuthProvider, useAuth } from "../../services/authService";

function ProfileDummy() {
    
    const {signOut} = useAuth();

    const onSignOutPressed = () => {
        signOut();        
    }

    return(
        <ScrollView>
            <Center p='3' m='3' backgroundColor='red.700' borderRadius={10}>
                <Text fontSize='3xl' fontWeight={500} color='white'>Profile Coming Soon</Text>
            </Center>
            <Box m='2' p='5' borderWidth='2' borderRadius='md'>
                <Center>
                    <Text fontSize='2xl' fontWeight='bold'>John Doe</Text>
                    <Text fontSize='md' fontWeight='100'>Avid lifter of bigg, heavy objects</Text>
                    <HStack justifyContent='space-between'>
                        <VStack>
                            <Box  m='3' py='10' px='20' bg='violet.300' borderRadius='lg'></Box>
                            <Box  m='3' py='10' px='20' bg='violet.500' borderRadius='lg'></Box>
                            <Box  m='3' py='10' px='20' bg='violet.700' borderRadius='lg'></Box>
                        </VStack>
                        <VStack>
                            <Box  m='3' py='10' px='20' bg='violet.700' borderRadius='lg'></Box>
                            <Box  m='3' py='10' px='20' bg='violet.500' borderRadius='lg'></Box>
                            <Box  m='3' py='10' px='20' bg='violet.300' borderRadius='lg'></Box>
                        </VStack>
                    </HStack>
                </Center>
            </Box>
            <Center><CustomButton text="Sign Out" onPress={onSignOutPressed}/></Center>
        </ScrollView>
    )
}

export default  ProfileDummy;