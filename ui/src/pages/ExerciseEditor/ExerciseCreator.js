import React from 'react';
import { Box , Text , ScrollView , Center , Input , TextArea , Checkbox, HStack, VStack, Divider , Button, Select, CheckIcon, View, Radio } from "native-base";

import { useExercises } from '../../services/exerciseService';
import Body from 'react-native-body-highlighter'

function parseBodyIngress(mList){
    let output = []
    for(x of mList){
        output.push({
            slug: x,
            intensity: 1
        })
    }
    return output;
}

function ExerciseCreator(props){
    const { navigation, route } = props;
    const [muscleHighlights, setGroupValues] = React.useState([]);
    const [name, setName] = React.useState([]);
    const [description, setdescription] = React.useState([]);
    const [attachment, setAttachment] = React.useState([]);
    const [muscleGroup,setMuscleGroup] = React.useState([]);
    const [sets, setSets] = React.useState([]);
    const [newSetType, setNewSetType] = React.useState();
    const [newSetComment, setNewSetComment] = React.useState();

    const handleN = text => {setName(text)}
    const handleD = text => {setdescription(text)}
    const handleA = text => {setAttachment(text)}

    const { createExercise } = useExercises();
    
    const handleSubmit = () => {
        const dbObj = {
            name: name,
            creatorId: '0123456789',
            muscleGroup: muscleGroup,
            muscleHighlight: muscleHighlights,
            description: description,
            attachements: attachment,
            sets: sets
        }
        createExercise(dbObj)
        navigation.goBack()
    }

    const manageSubmitButton = () => {
        if(name.length < 1){
            return(
                <View>
                    <Button m='5' backgroundColor='blue.500' isDisabled>Save</Button>
                    <Text color='red.500' mb='2'>Please enter a name</Text>
                </View>
            )
        }
        else if(muscleGroup.length < 1){
            return(
                <View>
                    <Button m='5' backgroundColor='blue.500' isDisabled>Save</Button>
                    <Text color='red.500' mb='2'>Please select a muscle group</Text>
                </View>
            )
        }
        else
            return(
                <Button onPress={()=>handleSubmit()} m='5' backgroundColor='blue.500'>Save</Button>
            )
    }

    const setPreview = () => {
        return(
            <View>
                <HStack ml='8' width='80%' justifyContent='space-between'>
                    <Text>Set number</Text>
                    <Text>Set Type</Text>
                    <Text>Set Comments</Text>
                </HStack>
                <Center>
                    <Divider width="100%"/>
                </Center>
                {sets?.map((set, index) => {
                    //return(<Text >Set{index+1}: {(set.type)?set.type:null} | {set.comments}</Text>)
                    return(
                        <HStack ml='8' width='80%' justifyContent='space-between'>
                            <Text>{index+1}</Text>
                            <Text>{(set.type)?set.type:null}</Text>
                            <Text maxW={60}>{set.comments}</Text>
                        </HStack>
                    )
                })}
                <Center>
                    <Divider width="100%"/>
                </Center>
            </View>
        )
    }

    const onAddPress = () => {
        setSets([...sets, { type: newSetType, comments: newSetComment }]);      
    }

    return(
        <ScrollView>
            <Center>
                <Box bg='blue.700' m='3' px='12' py='8' borderRadius='xl'>
                    <Text fontSize='3xl' fontWeight='bold' color='white'>Create Exercise</Text>
                </Box>
            </Center>
            <Text underline mx='5' mt='5'>Exercise Name</Text>
            <Input onChangeText={handleN} size="md" placeholder={"Front Squats"} py='3' my='3'mx='5'></Input>
            <Text underline mx='5' mt='5'>Description</Text>
            <TextArea onChangeText={handleD} size="md" py='3' my='3'mx='5' placeholder="A great exercise for quads!"></TextArea>
            <Text underline mx='5' mt='5'>Attachment</Text>
            <Input onChangeText={handleA} size="md" placeholder="Attachment link" py='3' my='3'mx='5'></Input>
            <Text underline mx='5' mt='5'>Muscle Group</Text>

            <Select selectedValue={muscleGroup} 
                    minWidth="200" accessibilityLabel="Choose Muscle Group" 
                    placeholder="Choose Muscle Group" 
                    _selectedItem={{bg: "teal.600",endIcon: <CheckIcon size="5" />}} 
                    m={4} mb={6}
                    onValueChange={itemValue => setMuscleGroup(itemValue)}>
                <Select.Item label="Arms" value="arms" />
                <Select.Item label="Back" value="back" />
                <Select.Item label="Chest" value="chest" />
                <Select.Item label="Core" value="core" />
                <Select.Item label="Hip" value="hip" />
                <Select.Item label="Legs" value="legs" />
                <Select.Item label="Shoulder" value="shoulder" />
            </Select>

            <View>
                <Text underline mx='5' my='5'>Sets</Text>
                    {setPreview()}
                    <View backgroundColor='blue.100' my='2'>
                        <Text underline mx='5' mt='5'>Add a Set</Text>
                            <Select selectedValue={newSetType} accessibilityLabel="set type" placeholder="Select set type"  py='3' my='3'mx='5' _selectedItem={{
                                bg: "blue.200", 
                                endIcon: <CheckIcon size="5" />
                            }} mt={1} onValueChange={selectedValue => setNewSetType(selectedValue)}>
                                <Select.Item label="Warmup" value="warmup" />
                                <Select.Item label="Working" value="working" />
                                <Select.Item label="Drop" value="drop" />
                            </Select>
                                       
                        <Input onChangeText={(newText) => {setNewSetComment(newText)}} size="md" placeholder={"Add comment here"} py='3' my='3'mx='5'></Input>
                        <Center>
                            <Button onPress={onAddPress} m='5' backgroundColor='blue.500'>Add to Workout</Button>
                        </Center>
                    </View>
            </View>
            
            <Box borderWidth='2' borderColor='blue.800' borderRadius='lg' m='2' p ='2'>
                <Center>
                    <Text fontSize='lg' fontWeight='bold' m='3' underline>Select Target Muscles Groups</Text>
                </Center>
                <Checkbox.Group onChange={setGroupValues} value={muscleHighlights} defaultValue={muscleHighlights} accessibilityLabel="choose numbers">
                    <HStack width='100%' alighnItems='center' justifyContent='space-between'>
                        <VStack>
                            <Checkbox my='2' ml='1' value="trapezius">trapezius</Checkbox>
                            <Checkbox my='2' ml='1' value="front-deltoids">front-deltoids</Checkbox>
                            <Checkbox my='2' ml='1' value="chest">chest</Checkbox>
                            <Checkbox my='2' ml='1' value="triceps">triceps</Checkbox> 
                            <Checkbox my='2' ml='1' value="upper-back">upper-back</Checkbox>
                            <Checkbox my='2' ml='1' value="abs">abs</Checkbox>
                            <Checkbox my='2' ml='1' value="gluteal">gluteal</Checkbox>
                            <Checkbox my='2' ml='1' value="abductors">abductors</Checkbox>
                            <Checkbox my='2' ml='1' value="quadriceps">quadriceps</Checkbox>
                        </VStack>
                        <VStack>
                            <Checkbox my='2' ml='1' value="neck">neck</Checkbox>                            
                            <Checkbox my='2' ml='1' value="back-deltoids">back-deltoids</Checkbox>                            
                            <Checkbox my='2' ml='1' value="biceps">biceps</Checkbox>
                            <Checkbox my='2' ml='1' value="forearm">forearm</Checkbox>
                            <Checkbox my='2' ml='1' value="obliques">obliques</Checkbox>
                            <Checkbox my='2' ml='1' value="lower-back">lower-back</Checkbox> 
                            <Checkbox my='2' ml='1' value="adductor">adductor</Checkbox>
                            <Checkbox my='2' ml='1' value="hamstring">hamstring</Checkbox>
                            <Checkbox my='2' ml='1' value="calves">calves</Checkbox>
                        </VStack>
                    </HStack>
                </Checkbox.Group>
                <Divider mt='3'/>
                <Center m='5'>
                    <Body data={parseBodyIngress(muscleHighlights)}></Body>
                </Center>    
            </Box>
            <Center>
                {manageSubmitButton()}
            </Center>
        </ScrollView>
    );
}

export default ExerciseCreator;