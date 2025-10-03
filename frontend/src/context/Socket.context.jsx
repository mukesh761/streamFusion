import React, { createContext, useEffect, useMemo } from 'react'
import {io} from "socket.io-client"
export const socketContext=createContext()

const SocketProvider=({children})=>{
    const socket=io("https://streamfusion-g74n.onrender.com")
    useEffect(()=>{
        socket.emit('connection')
       
    })
    return(
        <socketContext.Provider value={{socket}}>
            {children}
        </socketContext.Provider>
    )
}

export {SocketProvider}