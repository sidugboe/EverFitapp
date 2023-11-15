import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    AppBarHeaderpadding: {
        paddingTop: 4,
        paddingStart: 15,
        paddingEnd: 15,
        height: 60
    },
    AppBarContainer: {
        color: 'white',
        height: 55,
        width: '100%',
        backgroundColor: 'white',
        elevation: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
    },
        RoutineWorkoutExerciseListContiner: {
        height: '100%'
    },
    ExerciseScreenCards: {
        borderRadius: 18
    }
});

export default styles;