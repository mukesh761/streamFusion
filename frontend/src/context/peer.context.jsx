import React from "react";
import { createContext } from "react";

const peerContext= createContext()

const PeerProvider=({children})=>{
     const peer=new RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.l.google.com:19302",
            }
        ],
    });
    const createOffer=async ()=>{
        const offer=await peer.createOffer()
        console.log('creating offer')
        await peer.setLocalDescription(offer)
        return offer
    }

    const createAnswer=async (offer)=>{
        await peer.setRemoteDescription(offer)
        const answer= await peer.createAnswer();
        console.log('creating answer')
        await peer.setLocalDescription(answer)
        return answer
    }

    const addAnswer=async (answer)=>{
        await peer.setRemoteDescription(answer)
        console.log('setting answer')
    }

    return (
        <peerContext.Provider value={{peer,createOffer,createAnswer,addAnswer}}>
            {children}
        </peerContext.Provider>
    )
}

export {PeerProvider,peerContext}