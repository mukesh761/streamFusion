import React from 'react';
import { useContext } from 'react';
import { useEffect } from 'react';
import { socketContext } from '../context/Socket.context';
import { peerContext } from '../context/Peer.context';
import { useCallback } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { BsCameraVideoFill } from "react-icons/bs";
import { BsCameraVideoOffFill } from "react-icons/bs";
import { MdCallEnd } from "react-icons/md";
import { FaMicrophone } from "react-icons/fa";
import { FaMicrophoneSlash } from "react-icons/fa";
import {useNavigate, useParams} from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
const Confress = () => {
	const [cameraIsOn, setcameraIsOn] = useState(true)
	const [micIsOn, setmicIsOn] = useState(true)
	const localStreamRef=useRef()
	const [snapshot,setSnapshot]=useState(null)
	const [localStream,setlocalStream]=useState()

	const localVideoRef = useRef()
	const remoteVideoRef = useRef()
	const { createOffer, createAnswer, addAnswer, peer } = useContext(peerContext)
	const { socket } = useContext(socketContext)
	const {roomId}=useParams()
	const navigate=useNavigate()

	const handleNewUser = useCallback(async ({ email }) => {
		const offer = await createOffer()
		socket.emit('handleOffer', { offer })
	}, [socket, createOffer])

	const handleIncomingCall = useCallback(async ({ offer }) => {
		const answer = await createAnswer(offer)
		socket.emit('handleAnswer', { answer })
	}, [socket, createAnswer])

	const handleReceivedCall = useCallback(async ({ answer }) => {
		await addAnswer(answer);
	}, [socket, addAnswer])

	const startVideo = useCallback(async () => {
	
		
		const localStream = await navigator.mediaDevices.getUserMedia({ audio:true, video: true })
		localStreamRef.current=localStream
		
		if (localVideoRef.current) {
			

			localVideoRef.current.srcObject = localStream
		}
		setlocalStream(localStream)
	}, [peer])

	useEffect(() => {
		console.log('starting the video')
		startVideo()
	}, [peer,socket])

	

	const handleTrack = useCallback(async (event) => {
		console.log('handling tracks')
		const incomingStreams = event.streams[0]
		console.log({ incomingStreams })
		if (remoteVideoRef.current) {
			remoteVideoRef.current.srcObject = incomingStreams;
			console.log(remoteVideoRef.current.srcObject)
		}
	}, [peer])

	const handleNegotiation = useCallback(async (e) => {
		console.log('handling negotiation ')
		const offer = await createOffer()
		socket.emit('nego:offer', { offer })
	}, [socket, createOffer])

	const handleNegoOffer = useCallback(async ({ offer }) => {
		const answer = await createAnswer(offer)
		console.log('creating answer in negotiation')
		socket.emit('nego:answer', { answer })
	}, [socket, createAnswer])

	const handleNegoAnswer = useCallback(async ({ answer }) => {
		await addAnswer(answer)
		console.log('negotiation final')
	}, [socket, addAnswer])

	const hangCall=useCallback(async ()=>{
		localStreamRef.current.getTracks().forEach(track=> track.stop())
		console.log({localVideoRef})
		await peer.close()
		console.log('hanging call')
		console.log(roomId)
		socket.emit('hangCall',{roomId})
		navigate('/')
		
	},[peer])

	const handleCallended=useCallback(async ()=>{
		if(peer){
			await peer.close()
		}
		if(remoteVideoRef.current){
			remoteVideoRef.current.srcObject=null
		}
		if(localVideoRef.current){
			localVideoRef.current.srcObject=null
		}
		toast('call ended')
		setTimeout(()=>{

			navigate('/')
		},3500)
	},[peer,hangCall])

	const cameraOff=useCallback(()=>{
		localVideoRef.current.pause()
		setcameraIsOn(false)
		socket.emit('cameraOff',{roomId})
	},[socket])

	const handleCameraOff=useCallback(()=>{
		const video = remoteVideoRef.current;
  // Take a snapshot of current frame
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imgUrl = canvas.toDataURL("image/png");

  // Display the snapshot image while video continues playing (hidden)
  setSnapshot(imgUrl);
	},[socket,cameraOff])

	const cameraOn=useCallback(()=>{
		localVideoRef.current.play()
		setcameraIsOn(true)
		socket.emit('cameraOn',{roomId})
	},[socket])

	const handleCameraIsOn=useCallback(()=>{
		remoteVideoRef.current.play()
		setSnapshot(null)
		toast('camera is on ')
	},[socket,cameraOn])
	
	const micOff=useCallback(()=>{
		localVideoRef.current.muted=true
		setmicIsOn(false)
		socket.emit('micOff',{roomId})
	},[socket])
	const handleMicOff=useCallback(()=>{
		remoteVideoRef.current.muted=true;
		console.log('mic turned off')
	},[socket,micOff])
	const micOn=useCallback(()=>{
		setmicIsOn(true)
		socket.emit('micOn',{roomId})
	},[socket])
	const handleMicOn=useCallback(()=>{
		remoteVideoRef.current.muted=false
		console.log('mic is on')
	},[socket,micOn])

	const sendVideo=useCallback((localStream)=>{
		console.log('sending video to other peer')
		console.log(localStream)
		localStream.getTracks().forEach(track => {
			peer.addTrack(track, localStream);
		});
	},[handleReceivedCall,peer])
	useEffect(() => {
		socket.on('newUser', handleNewUser)
		socket.on('incomingCall', handleIncomingCall)
		socket.on('receivedCall', handleReceivedCall)
		if(localStream){

			sendVideo(localStream)
		}

		return (() => {
			socket.off('newUser', handleNewUser)
			socket.off('incomingCall', handleIncomingCall)
			socket.off('receivedCall', handleReceivedCall)



		})
	}, [socket, handleIncomingCall, handleNewUser, handleReceivedCall,sendVideo,localStream])

	useEffect(() => {
		peer.addEventListener('track', handleTrack)
		peer.addEventListener('negotiationneeded', handleNegotiation);
		return (() => {
			peer.removeEventListener('track', handleTrack)
			peer.removeEventListener('negotiationneeded', handleNegotiation);

		})
	}, [peer, handleTrack, handleNegotiation,startVideo,sendVideo])

	useEffect(() => {
		socket.on('nego:handleOffer', handleNegoOffer)
		socket.on('nego:handleAnswer', handleNegoAnswer)
		return (() => {
			socket.off('nego:handleOffer', handleNegoOffer)
			socket.off('nego:handleAnswer', handleNegoAnswer)
		})
	}, [handleNegotiation])

	useEffect(()=>{
		socket.on('callEnded',handleCallended)
		socket.on('cameraIsOff',handleCameraOff)
		socket.on('cameraIsOn',handleCameraIsOn)
		socket.on('micIsOff',handleMicOff)
		socket.on('micIsOn',handleMicOn)
		return(()=>{
			socket.off('callEnded',handleCallended)
		socket.off('cameraIsOff',handleCameraOff)
		socket.off('cameraIsOn',handleCameraIsOn)
		socket.off('micIsOff',handleMicOff)
		socket.off('micIsOn',handleMicOn)




		})
	},[socket,hangCall,cameraOff,cameraOn,micOff,micOn])

	return (
		<div>
			<div className='h-screen w-screen flex items-center justify-center relative '>
				<div className='h-screen w-[50%] border-l-2 bg-green-500'>
					<video
						className='h-full w-full '
						ref={localVideoRef}
						muted
						playsInline
						autoPlay
					/>
				</div>
				<div className='h-screen w-[50%] bg-red-600 border-l-2 relative'>
					<video
						className='h-full w-full'
						ref={remoteVideoRef}
						playsInline
						muted
						autoPlay
					/>
					  {snapshot && (
    <img
      src={snapshot}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    />
  )}

				</div>
			</div>
			<div className='h-20 w-screen bg-blue-200 absolute bottom-0 flex items-center justify-center gap-30'>
				{cameraIsOn ? <div className='h-10 w-10 rounded-full bg-blue-300 flex items-center justify-center hover:bg-blue-600 cursor-pointer' onClick={cameraOff}>
					<BsCameraVideoOffFill />
				</div>

					: <div className='h-10 w-10 rounded-full bg-blue-300 flex items-center justify-center hover:bg-blue-600 cursor-pointer' >
						<BsCameraVideoFill onClick={cameraOn} />
					</div>}


				<div className='h-10 bg-red-500 w-20 flex items-center justify-center rounded-3xl hover:bg-red-800' onClick={hangCall}>
					<MdCallEnd />
				</div>
				{micIsOn ? <div className='h-10 w-10 rounded-full bg-blue-300 flex items-center justify-center hover:bg-blue-600 cursor-pointer'  onClick={micOff}>
					<FaMicrophoneSlash  />
				</div>

					: <div className='h-10 w-10 rounded-full bg-blue-300 flex items-center justify-center hover:bg-blue-600 cursor-pointer' onClick={micOn}>
						<FaMicrophone />
					</div>}


			</div>
			<ToastContainer
			autoClose={2000}
			/>
		</div>
	);
}

export default Confress;
