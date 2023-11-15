import { useAuth } from "./authService";

/**
 * Stateless hook that contains functions for exercises that have been moved out of useExercises hook. Created so components don't need to implement unnessessary useExercises hook STATE if they don't need to. The useExercises hook will simply hook into this hook to use it functions.
 * @returns functions for exercises
 */
const useExerciseFunctions = () => {
    const { userToken, isLoading: isLoadingAuth } = useAuth()

    /**
     * Creates a new exercise record
     * @param {Object} dnewExercisebObj exercise being created
     */
    const createExercise = (newExercise) => {
        fetch('http://3.138.86.29/exercise/templates',{
            method:'POST',
            headers: {  
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + userToken 
            },
            body: JSON.stringify(newExercise)
        })
        .then((response) => response.json())
    }

    /**
     * Edits an exercise record
     * @param {Object} exercise  exercise being edited with any updated properties
     * @returns 
     */
    const editExercise = (exercise, exID) => {
        fetch('http://3.138.86.29/exercise/templates',{
                method:'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + userToken
                },
                body: JSON.stringify(exercise)
        })
        .then((response) => response.text())
        .then((response) => console.log(response))
    }

    /**
     * Gets an exercise by id -  either needs to be public or belongs to the user
     * @param {string} exerciseId id of the exercise to GET
     * @returns {Promise} that will either resolve or reject
     */
    const getExerciseById = (exerciseId) => {
        let response = fetch('http://3.138.86.29/exercise/templates/' + exerciseId, { headers: {'Authorization': "Bearer " + userToken}})
                .then((response) => response.json())
                .catch((e) => {
                    throw e
                })

        // return the result as a promise
        return response;
    }

    /**
     * Gets all public exercises
     * @returns array containing all public exercises (exerciseTamplates)
     */
    const getPublicExercises = async () => {
        let response = await fetch('http://3.138.86.29/public/exercise/templates', { headers: {'Authorization': "Bearer " + userToken}})
            .then((response) => response.json())
            .catch((e) => {
                throw e
            })
        return response
    }

    /**
     * Sets an exercise to public
     * @param {string} exercise to be set to public
     */
    const setExerciseToPublic = (exercise) => {
        // assumes check for private access has already been done
        let updatedExercise = {...exercise, access: "public"}

        let response = fetch('http://3.138.86.29/exercise/templates',{
                method:'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + userToken
                },
                body: JSON.stringify(updatedExercise)
            })
            .then((response) => response.json())

            // return response as proimise
            return response
    }


    /**
     * Fetches exercises for by ids provided
     * @param {Array} exerciseIds array of exercise ids to be fetched
     * @returns {Array} Array of promises for each of the fetches
     */
    const getExercisesById = (exerciseIds) => {
        let promises = [];
        for(let exerciseId of exerciseIds){
            let promise = getExerciseById(exerciseId)
            promises.push(promise)
        }

        // return the array of promises (assume fullfillment/ allSettled will be performed by the calling component)
        return promises
    }

    return {
        createExercise,
        editExercise,
        getExerciseById,
        getPublicExercises,
        setExerciseToPublic,
        getExercisesById
    }
}

export { useExerciseFunctions };

// implement in component by doing
// const { exercises, createExercise /* + other methods */ } = useExercises();