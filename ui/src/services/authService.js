import React, { useContext, useState, useEffect } from "react";
import { useAsyncStorage } from "../utils/helpers/useAsyncStorage";
import { createContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create a new Context object that will be provided to descendants of
// the AuthProvider.
const AuthContext = createContext(); 

// custom hook providing authentication functionality and current user data to whatever component that implements it
const AuthProvider = ({children}) => {

    // component state
    const [userToken, setUserToken] = useState("");
    const [user, setUser] = useState({})
    const [isLoading, setIsLoading] = useState(true);

    // hook to access async storage
    const { getAyncStorageItem, setAsyncStorageItem, removeAsyncStorageItem} = useAsyncStorage()

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const forceReload = () => {
        setIsLoading(true)
        fetchUserInfo();
    }

    // gets token from local storage if it exists and gets user info from whoami endpoint
    const fetchUserInfo = async () => {
        setIsLoading(true)
        token = await getAyncStorageItem("token");
        if(token){
            
            setIsLoading(false) // set loading to false when token is aquired only
            setUserToken(token)
            fetchUserProfile(token);
        }
        else {
            setIsLoading(false)
            signOut();
        }
    }

    const fetchUser = async (userToken) => {
        await fetch('http://3.138.86.29/user/whoami',{
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        })
        .then((response) => response.json())
        .then((data) => {
            if(data){   
                // if there is a message associated with the token ex. expired token
                if(data.message){
                    signOut();
                }
                else {
                    setUser(data)
                    // save user to async storage
                    setAsyncStorageItem("user", JSON.stringify(data));
                }
            }
            else
                setUser(null);
        })
        .catch((e) => {
            /// Throw e
        })
    }

    // todo move fetchUserProfile (and fetchUser?) outside of useAuth as they are not as commonly used and might cause context re-rendering issues?
    const fetchUserProfile = async (userToken) => {
        await fetch('http://3.138.86.29/profile',{
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        })
        .then((response) => response.json())
        .then((data) => {
            if(data){   
                setUser(data)
                setIsLoading(false)

                // save user to async storage
                setAsyncStorageItem("userProfile", JSON.stringify(data));
            }
            else
                setUser(null)
        })
        .catch((e) => {
            /// Throw e
        })
    }

    const signIn = (username, password) => {

            const userCredentials = {
                username: username, 
                password: password
            }
    
            let response = fetch('http://3.138.86.29/user/login',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userCredentials)
            })
            .then((response) => response.json())
            .then(res => {
                let userInfo = res.token;
                
                if (res.token){
                    setUserToken(userInfo)
                    setAsyncStorageItem("token", userInfo);
                    fetchUserProfile(res.token);
                    return true;
                }
                else
                    return false;
            
            })
            .catch(e => {
                // Throw e
            })

            // return response as promise
            return response;

    }

    const signUp = (name, username, email, password) => {
        // http sign up request
        const dbObj = {
            name: name,
            username: username, 
            email: email,
            password: password
        }

        fetch('http://3.138.86.29/user/signup',{
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dbObj)
        })
        .then((response) => response.json())
            .then(res => {
                let userInfo = res.token;
                if (res.token){
                    setUserToken(userInfo)
                    setAsyncStorageItem("token", userInfo);
                    setAsyncStorageItem("userInfo",userInfo);
                }  
            })
            .catch(e => {
                throw e
            })


    }

    // clear token and user data consequently signing the user out
    const signOut = () => {
        setUserToken(null);
        setUser(null)
        removeAsyncStorageItem('token');
        removeAsyncStorageItem('user')
    }

    // Might need to add an isLoading function to not show the sign in screen when reopening the app while the the key is still stored in the local storage (not signed out)

    return ( 
        <AuthContext.Provider value={{
            userToken,
            user,
            isLoading,
            signIn,
            signUp,
            signOut,
            refetchUser: fetchUserInfo,
            forceReload,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

// The useAuth hook can be used by components under an AuthProvider to access the auth context value.
const useAuth = () => {
    const auth = useContext(AuthContext);
    if (auth == null) {
        throw new Error("useAuth() called outside of a AuthProvider?");
    }
    return auth;
};

export { AuthProvider, useAuth };

// implement in component by doing
// const { user, signIn, signUp, signOut } = useAuth();