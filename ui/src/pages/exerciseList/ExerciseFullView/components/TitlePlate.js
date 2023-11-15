import { View, Center, Text , Box ,} from 'native-base';

const config = {dependencies: {'linear-gradient': require('react-native-linear-gradient').default}};

let gradient1 = {
    linearGradient: {
      colors: ['lightBlue.300', 'violet.800'],
      start: [0, 0],
      end: [1, 0],
    },
}

function TitlePlate(props){
    return(
        <>
            <Box config={config}>
                <Center m="2" p='9' borderRadius='md' bg={gradient1} shadow={2}>
                    <Text fontSize="3xl" fontWeight="bold" color='white'>{props.title}</Text>
                </Center>
            </Box>

            <Box>
                <Center m="2" p='9' borderRadius='md' bg={'blue.400'} shadow={2}>
                    <Text fontSize="3xl" fontWeight="bold" color='white'>{props.title}</Text>
                </Center>
            </Box>
        </>
        
        
    )
}

export default TitlePlate;

