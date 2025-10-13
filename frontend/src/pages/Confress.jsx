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
	},[socket,createOffer])

	const handleIncomingCall=useCallback(async ({offer})=>{
		const answer= await createAnswer(offer)
		socket.emit('handleAnswer',{answer})
	},[socket,createAnswer])

	const handleReceivedCall=useCallback(async({answer})=>{
		await addAnswer(answer);
	},[socket,addAnswer])

	const startVideo=useCallback(async ()=>{
		const localStream=await  navigator.mediaDevices.getUserMedia({audio:true,video:true})
		setlocalVideo(localStream)
		if(localVideoRef.current){

			localVideoRef.current.srcObject=localStream
		}
		localStream.getTracks().forEach(track => {
      peer.addTrack(track, localStream);
    });
	},[peer])

	useEffect(()=>{
		console.log('starting the video')
		startVideo()
	},[])

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
	
	const handleTrack=useCallback(async (event)=>{
		console.log('handling tracks')
		const incomingStreams=event.streams[0]
		console.log({incomingStreams})
		if(remoteVideoRef.current){
			remoteVideoRef.current.srcObject=incomingStreams;
			console.log(remoteVideoRef.current.srcObject)
		}
	},[])

	const handleNegotiation=useCallback(async (e)=>{
		console.log('handling negotiation ')
		const offer= await createOffer()
		socket.emit('nego:offer',{offer})
	},[socket,createOffer])

	const handleNegoOffer=useCallback(async ({offer})=>{
		const answer=await createAnswer(offer)
		console.log('creating answer in negotiation')
		socket.emit('nego:answer',{answer})
	},[socket,createAnswer])
	
	const handleNegoAnswer=useCallback(async ({answer})=>{
		await addAnswer(answer)
		console.log('negotiation final')
	},[socket,addAnswer])

	useEffect(()=>{
		peer.addEventListener('track',handleTrack)
		peer.addEventListener('negotiationneeded', handleNegotiation);
		return (()=>{
			peer.removeEventListener('track', handleTrack)
		peer.removeEventListener('negotiationneeded', handleNegotiation);

		})
	},[peer,handleTrack,handleNegotiation])

	useEffect(()=>{
		socket.on('nego:handleOffer',handleNegoOffer)
		socket.on('nego:handleAnswer',handleNegoAnswer)
		return (()=>{
			socket.off('nego:handleOffer',handleNegoOffer)
		socket.off('nego:handleAnswer',handleNegoAnswer)
		})
	},[handleNegotiation])

	return (
	  <div className='h-screen w-screen flex items-center justify-center '>
		<div className='h-screen w-[50%] border-l-2 bg-green-500'>
			<video
			className='h-full w-full '
			ref={localVideoRef}
			muted
			playsInline
			autoPlay
			/>
		</div>
		<div  className='h-screen w-[50%] bg-red-600 border-l-2'>
			<video
			className='h-full w-full'
			ref={remoteVideoRef}
			playsInline
			autoPlay
			/>
		</div>
	  </div>
	);
  }
  
  export default Confress;
  