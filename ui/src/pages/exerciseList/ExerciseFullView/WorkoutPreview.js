import { Box, Text } from "native-base";
import { ScrollView } from "react-native";
import ExerciseView from "./components/ExerciseView";
import { useExercises } from "../../services/exerciseService";



function WorkoutPreview(props) {
    const { exercises } = useExercises();
    const buildPreview = (data) => {
        const { navigation, route} = props

        let output = [];
        let exerciseCount = 1;
        for(ex of data){
            output.push(
                <Box my='2' key={ex.name}>
                    <ExerciseView exercise={ex} exerciseNum={exerciseCount} navigation={navigation}></ExerciseView>
                </Box>
            )
            exerciseCount++;
        }
        return output;
    }

    return(
        <ScrollView>
            <Box borderWidth='2'>
                {buildPreview(exercises)}
            </Box>
        </ScrollView>
    )
}

export default WorkoutPreview;