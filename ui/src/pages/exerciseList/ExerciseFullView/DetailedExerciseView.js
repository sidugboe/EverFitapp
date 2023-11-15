import { NativeBaseProvider, Box, Text , ScrollView} from "native-base";
import ExerciseView from "./components/ExerciseView";
import { useExercises } from "../../services/exerciseService";

function DetailedExerciseView ({ navigation, route}) {
    let ex = route.params.exData;

    return(
        <ScrollView my='2' key={ex.name}>
            <ExerciseView exercise={ex} navigation={navigation}></ExerciseView>
        </ScrollView>
    )
}

export default DetailedExerciseView;