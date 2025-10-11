import React from 'react';
import { useContext } from 'react';
import { useEffect } from 'react';
import { socketContext } from '../context/Socket.context';
import { peerContext } from '../context/Peer.context';
import { useCallback } from 'react';
import { useRef } from 'react';
import { useState } from 'react';

  
  const Confress = () =>  {
	const [localVideo, setlocalVideo] = useState(null)
	const [remoteVideo, setremoteVideo] = useState(null)

	const localVideoRef=useRef()
	const remoteVideoRef=useRef()
	const {createOffer,createAnswer,addAnswer,peer}=useContext(peerContext)
	const {socket}=useContext(socketContext)

	const handleNewUser=useCallback(async ({email})=>{
		const offer=await createOffer()
		socket.emit('handleOffer',{offer})
	},[])

	const handleIncomingCall=useCallback(async ({offer})=>{
		const answer= await createAnswer(offer)
		socket.emit('handleAnswer',{answer})
	},[])

	const handleReceivedCall=useCallback(async({answer})=>{
		await addAnswer(answer);
	},[])

	const startVideo=async ()=>{
		const localStream=await  navigator.mediaDevices.getUserMedia({audio:true,video:true})
		setlocalVideo(localStream)
		if(localVideoRef.current){

			localVideoRef.current.srcObject=localStream
		}
		localStream.getTracks().forEach(track => {
      peer.addTrack(track, localStream);
    });
	}

	useEffect(()=>{
		socket.on('newUser',handleNewUser)
		socket.on('incomingCall',handleIncomingCall)
		socket.on('receivedCall',handleReceivedCall)

		return (()=>{
		socket.off('newUser',handleNewUser)
		socket.off('incomingCall',handleIncomingCall)
		socket.off('receivedCall',handleReceivedCall)



		})
	},[socket,handleIncomingCall,handleNewUser,handleReceivedCall])
	
	const handleTrack=async (event)=>{
		const incomingStreams=event.streams[0]
		console.log({incomingStreams})
		if(remoteVideoRef.current){
			remoteVideoRef.current.srcObject=incomingStreams;
		}
	}

	useState(()=>{
		peer.addEventListener('track',handleTrack)
	},[startVideo])

	return (
	  <div>
		<div>
			<h1>local video</h1>
			<video
			ref={localVideoRef}
			muted
			playsInline
			autoPlay
			src={localVideo}
			/>
		</div>
		<div>
			<h1>local video</h1>
			<video
			ref={remoteVideoRef}
			
			playsInline
			autoPlay
			src={localVideo}
			/>
		</div>
		<button onClick={startVideo}>start video</button>
	  </div>
	);
  }
  
  export default Confress;
  