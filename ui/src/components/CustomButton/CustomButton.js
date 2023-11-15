import { Spinner } from "native-base";
import React from "react";
import { Text, StyleSheet, Pressable } from "react-native";

const CustomButton = ({onPress,text,type ="PRIMARY", bgColor, fgColor, isLoading}) => {
  return(
      <Pressable 
      onPress={onPress} 
      style={[
        styles.container, 
        styles[`container_${type}`],
        bgColor ? {backgroundColor:bgColor}: {}
      ]}>
        { isLoading ? 
            <Spinner size="sm" />
            :
            <Text style = {[ styles.text, styles[`text_${type}`], fgColor ? {color: fgColor} : {}]}>
                {text}
            </Text>
        }
      </Pressable>
  )
};

const styles = StyleSheet.create({
  container: {
      width: '70%',

      padding: 15,
      marginVertical:5,
      alignItems: 'center',
      borderRadius:5,

  },
  container_PRIMARY:{
    backgroundColor: '#3B71F3',

  }, 
  container_TERTIARY:{

  },
  text: {
    fontWeight:'bold',
    color: 'white'
  },
  text_TERTIARY:{
    color: 'grey'

  },
})

export {CustomButton}