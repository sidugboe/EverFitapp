import { Center, VStack, Text} from 'native-base';

function ImprovementTip(props){
    return(
        <Center m='5' p='2' borderColor='black' borderWidth='2' borderRadius='lg'>
            <VStack textAlig='center'>
                <Center>
                    <Text fontSize='2xl' fontWeight='bold' color='violet.800'>How to Improve</Text>
                    <Text m='2'>{props.tips}</Text>
                </Center>
            </VStack>
        </Center>
    )
}

export default ImprovementTip;