import React, { useState, useEffet } from 'react'
import { View } from 'react-native';
import { Skeleton, VStack, HStack, Center } from 'native-base';

const ExplorePageSkeleton = ({}) => {

    return (
        <Center w="100%" marginTop={"10"}>
            <HStack w="100%" rounded="md" _dark={{borderColor: "coolGray.500"}} _light={{borderColor: "coolGray.200"}}>
                {/* <Skeleton flex="1" h="150" rounded="md" startColor="coolGray.100" /> */}
                <VStack flex="3" space="4">
                    <Skeleton.Text px="4" lines={2}/>
                    <Skeleton.Text px="4" lines={2}/>
                    <Skeleton.Text px="4" lines={2}/>
                    <Skeleton.Text px="4" lines={2}/>
                    <Skeleton.Text px="4" lines={2}/>
                    <Skeleton.Text px="4" lines={2}/>
                </VStack>
            </HStack>
        </Center>
    )   
}

export { ExplorePageSkeleton };