import React, { createContext, useContext, useEffect, useMemo } from "react";
import {io} from "socket.io-client"

const socketContext=createContext()


const SocketProvider=({children})=>{
   
    const socket=useMemo(()=>io('https://streamfusion-g74n.onrender.com'),[])
    
    useEffect(()=>{
        socket.on('connect',()=>{
            console.log('a new user joined socket',socket.id)
        })
    })
    return (
        <socketContext.Provider value={{socket}}>
            {children}
        </socketContext.Provider>
    )
}

export {SocketProvider,socketContext}
