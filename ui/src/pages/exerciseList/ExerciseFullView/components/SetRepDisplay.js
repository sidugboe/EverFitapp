import { Text, HStack } from 'native-base'

function SetRepDisplay(props) {
    return(
        <HStack alignItems='center'>
            <Text fontSize='2xl' fontWeight='bold' mr='1' color='violet.800'>{props.sets}</Text>
            <Text fontSize='md' mr='3'>sets</Text>
            <Text fontSize='2xl' fontWeight='bold' mr='1' color='violet.800'>{props.reps}</Text>                        
            <Text fontSize='md'>reps</Text>
        </HStack>
    )
}

export default SetRepDisplay;