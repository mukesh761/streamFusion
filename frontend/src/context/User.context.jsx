import React, { createContext, useContext, useState } from "react";

const userContext= createContext()


const UserProvider=({children})=>{
    const [islogin, setislogin] = useState(false)
    const [user, setuser] = useState(null)
    return(

    <userContext.Provider value={{islogin,setislogin, user,setuser}}>
        {children}
    </userContext.Provider>
    )
}

export {UserProvider, userContext}