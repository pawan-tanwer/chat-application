import { createContext } from "react";
import {createcContext, useContext,useState} from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({children})=>{

    const [authUser,setAuthUser] = useState(JSON.parse(localStorage.getItem("chatapp")) || null);
    return <AuthContext.Provider value={{authUser,setAuthUser}}>
        {children}
    </AuthContext.Provider>
}