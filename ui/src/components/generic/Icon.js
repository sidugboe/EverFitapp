import { default as EvilIcon } from 'react-native-vector-icons/EvilIcons'
import { default as IonIcon } from 'react-native-vector-icons/Ionicons';
import { default as MaterialIcon } from 'react-native-vector-icons/MaterialIcons';
import { default as MaterialCommunityIcon } from 'react-native-vector-icons/MaterialCommunityIcons';

const Icon = (props) => {
    
    if(props.type === "materialCommunity"){
        return (
            <MaterialCommunityIcon {...props} />
        )
    }
    else if(props.type === "material"){
        return (
            <MaterialIcon {...props} />
        )
    }
    else if(props.type === "evil"){
        return (
            <EvilIcon {...props} />
        )
    }
    else if(props.type === "ion"){
        return (
            <IonIcon {...props} />
        )
    }
}

export { Icon };