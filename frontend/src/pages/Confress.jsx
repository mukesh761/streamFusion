import React, { useContext, useEffect, useRef, useState } from 'react';
import { peerContext } from '../context/Peer.context';
import { socketContext } from '../context/Socket.context';
import { useCallback } from 'react';

const Confress = () => {
  const [localStream, setlocalStream] = useState();
  const [remoteEmail,setremoteEmail]=useState()
  const [roomData,setroomData]=useState()
  const { peer,createOffer , createAnswer, addAnswer } = useContext(peerContext)
 
  const {socket}=useContext(socketContext)
  const localStreamRef = useRef()
  const remoteStreamRef = useRef()

  const handlelocalVideo = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    if (localStreamRef.current) {
      localStreamRef.current.srcObject = stream;
    }
    stream.getTracks().forEach(track => {
      peer.addTrack(track, stream)
      console.log(track)
    })
  }

  
  const handleNewUserJoined = async ({ data, email }) => {
    const offer = await createOffer()
    setremoteEmail(email)
    setroomData(data)
  
    socket.emit('makeCall', { data, to: email, offer })
  }

  const handleIncomingCall = async ({ offer, data}) => {
   
    const answer = await createAnswer(offer)


    socket.emit('sendAnswer',{answer,data})
    console.log('the call has setup')
  }

  const handleReceiveAnswer=async ({data,answer})=>{
    await addAnswer(answer)
    console.log('the user answer your call')
  }
  useEffect(() => {
    socket.on('IncomingCall', handleIncomingCall)
    socket.on('newUserJoined', handleNewUserJoined)
    socket.on('receiveAnswer',handleReceiveAnswer)
    return (() => {
      socket.off('IncomingCall', handleIncomingCall)
      socket.off('newUserJoined', handleNewUserJoined)
    socket.off('receiveAnswer',handleReceiveAnswer)

    })
  })


  const handleTrack = useCallback((event) => {
  const incomingStream = event.streams[0];
  if (remoteStreamRef.current) {
    remoteStreamRef.current.srcObject = incomingStream;
    console.log('video is playing')
  }
  else{
    console.log('remote video is not playable')
  }
}, []);

  const handleNegotiation=useCallback(()=>{
    console.log('negotiation needed')
    const localOffer=peer.localDescription;
    socket.emit('makeCall', { data:roomData, to: remoteEmail, offer:localOffer })
  })
  useEffect(() => {

    peer.addEventListener("track", handleTrack);
     peer.addEventListener('negotiationneeded',handleNegotiation)

    return () => {
      peer.removeEventListener("track", handleTrack);
       peer.removeEventListener('negotiationneeded',handleNegotiation)
    };
  }, [handleNegotiation,peer,handleTrack]);

  useEffect(() => {
    handlelocalVideo()


    return () => {
      if (localStreamRef.current?.srcObject) {
        localStreamRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [])

  return (
    <div>
      <div >
        <video
          ref={localStreamRef}
          autoPlay
          playsInline
          muted   // prevent feedback from mic
          width={200}
          height={200}
        />
        <video
          ref={remoteStreamRef}
          autoPlay
          playsInline
          // prevent feedback from mic
          width={200}
          height={200}
        />
      </div>
    </div>
  );
}

export default Confress;
