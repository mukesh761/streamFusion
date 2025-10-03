import React, { createContext, useContext, useMemo, useCallback } from 'react';
  
const peerContext = createContext();

export const usePeer = () => useContext(peerContext);

const PeerProvider = ({ children }) => {
    const peer = useMemo(() => new RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.l.google.com:19302",
            }
        ],
    }), []);

    const createOffer = useCallback(async () => {
        const offer = await peer.createOffer();
        console.log('creating offer');
        await peer.setLocalDescription(offer);
        return offer;
    }, [peer]);

    const createAnswer = useCallback(async (offer) => {
        await peer.setRemoteDescription(offer);
        console.log('creating answer');
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        return answer;
    }, [peer]);

    const addAnswer = useCallback(async (answer) => {
        console.log('setting remote answer');
        await peer.setRemoteDescription(answer);
    }, [peer]);

    return (
        <peerContext.Provider value={{ peer, createOffer, createAnswer, addAnswer }}>
            {children}
        </peerContext.Provider>
    );
};

export { PeerProvider, peerContext };