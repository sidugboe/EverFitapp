import { NativeBaseProvider, Box , Button , Center , Text, HStack , VStack , ScrollView , View} from "native-base";
import Body from "react-native-body-highlighter";

function parseBodyParam(muscleList){
    let output = []
    for(x of muscleList){
        output.push({
            slug: x,
            intensity: 1
        })
    }
    return output;
}

function itemizeMuscle(ml) {
    let output = [];
    let index = 0;

    for(m of ml){
        output.push(
            <Text mb='1' key={index++}>- {m}</Text>
        )
    }
    return(output);
}

/**
 * 
 * @param {*} props Props should contain a single list (muscles) that lists all engaged muscles
 * @returns Body diagram component along with a lgend of targetted muscles
 */
function BodyDiagram(props){
    let diagramData = parseBodyParam(props.muscles);

    return(
        <HStack py='5'>
            <Body data={diagramData} scale={.8}></Body>
            <VStack bg='blue.300' m='3' p='3' borderRadius='md'>
                <Text fontSize='md' fontWeight='bold' mb='2'>Target Muscles</Text>
                {itemizeMuscle(props.muscles)}
            </VStack>
        </HStack>
    ) 
}

export default BodyDiagram;