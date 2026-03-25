import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { peerContext } from '../context/Peer.context'
import { socketContext } from '../context/Socket.context'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { BsMicMuteFill } from "react-icons/bs";
import { ImPhoneHangUp } from "react-icons/im";
import { FaVideoSlash } from "react-icons/fa6";

const Confress = () => {
	const localVideoRef = useRef()
	const remoteVideoRef = useRef()
	const { peer, createOffer, createAnswer, addAnswer } = useContext(peerContext)
	const { socket } = useContext(socketContext)
	const { roomId } = useParams()
	console.log(roomId)
	console.log('socket. io ', socket.connected)
	const candidateQueue = useRef([]);
	const [muted, setmuted] = useState(false)
	const navigate=useNavigate()

	useEffect(()=>{
		openCamera()
	},[peer])

	const openCamera = useCallback(async () => {
		try {
			const localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
			if (localVideoRef.current) {
				localVideoRef.current.srcObject = localStream
				sendVideo(localStream)
			}
		} catch (error) {
			if (error) {
				console.log('problem opening camera',error)
			}
		}
	}, [peer, socket])

	const sendVideo = useCallback(async (localStream) => {
		console.log('sending local video ')
		localStream.getTracks().forEach(track => {
			peer.addTrack(track, localStream);
		});
	}, [peer, openCamera])

	const handleNegotiation = useCallback(async () => {
		const offer = await createOffer()
		console.log('handling negotiation ')
		const { email } = JSON.parse(localStorage.getItem('user'))
		console.log(socket)
		socket.emit('createOffer', { roomId, offer })
	}, [peer, createOffer, socket, roomId])

	useEffect(() => {
		peer.addEventListener('negotiationneeded', handleNegotiation);
		return (() => {
			peer.removeEventListener('negotiationneeded', handleNegotiation);
		})
	}, [createAnswer, peer, handleNegotiation])

	const handleIncomingOffer = useCallback(async ({ offer, roomId }) => {
		
		const answer = await createAnswer(offer)
		console.log('creating answer')
		socket.emit('handleAnswer', { answer, roomId })
	}, [peer, createAnswer])

	const handleIncomingAnswer = useCallback(async ({ answer, roomId }) => {
		console.log('setting answer')
		await addAnswer(answer)
	}, [peer, addAnswer])

	useEffect(() => {
		socket.on('handleOffer', handleIncomingOffer)
		socket.on('handleincominganswer', handleIncomingAnswer)

		return (() => {
			socket.off('handleOffer', handleIncomingOffer)
			socket.off('handleincominganswer', handleIncomingAnswer)


		})
	}, [handleNegotiation, handleIncomingOffer, peer, socket, createAnswer, addAnswer])

	const handleIceCandidate = useCallback((event) => {
		if (event.candidate) {
			console.log("Found Local Candidate:", event.candidate);
			socket.emit("ice:candidate", {
				candidate: event.candidate,
				roomId

			});
			console.log('event is fired ')
		}
	}, [socket, roomId]);

	// 2. When the other user sends a path, add it to your peer connection
	const handleIncomingIceCandidate = useCallback(async ({ candidate }) => {
    const iceCandidate = new RTCIceCandidate(candidate);

    // CHECK: Is the remote description set yet?
    if (peer.remoteDescription) {
        try {
            await peer.addIceCandidate(iceCandidate);
            console.log("✅ Added ICE Candidate");
        } catch (e) {
            console.error("Error adding ice candidate", e);
        }
    } else {
        // TOO EARLY: Queue it!
        console.warn("⚠️ Remote Description is null. Queueing candidate...");
        candidateQueue.current.push(iceCandidate);
    }
}, [peer]);

	// 3. Attach the listeners
	useEffect(() => {
		peer.addEventListener('icecandidate', handleIceCandidate);
		socket.on('ice:candidate', handleIncomingIceCandidate);

		return () => {
			peer.removeEventListener('icecandidate', handleIceCandidate);
			socket.off('ice:candidate', handleIncomingIceCandidate);
		};
	}, [peer, socket, handleIceCandidate, handleIncomingIceCandidate]);

	const handleTrack = useCallback(async (event) => {
		console.log('handling tracks')
		const incomingStreams = event.streams[0]
		console.log('incoming stream', incomingStreams)
		console.log("Video Tracks:", incomingStreams.getVideoTracks());
		if (remoteVideoRef.current) {
			if (remoteVideoRef.current.srcObject !== incomingStreams) {

				remoteVideoRef.current.srcObject = incomingStreams;
			}
			console.log(remoteVideoRef.current.srcObject)
			try {
				await remoteVideoRef.current.play();
			} catch (err) {
				console.error("Auto-play failed, user interaction needed:", err);
			}
		}
	}, [peer, sendVideo])


	useEffect(() => {
		peer.addEventListener('track', handleTrack)
		return (() => {
			peer.removeEventListener('track', handleTrack)
		})
	}, [ peer, handleTrack])

	const muteCall=()=>{
		console.log('this is indside mute call')
		socket.emit('mute-call')
	}

	const handleMuteCall=useCallback(()=>{
		setmuted(true)
		console.log('call is muted now')
	},[])

	useEffect(() => {
	  socket.on('mute-call',handleMuteCall)

	
	  return () => {
		socket.off('mute-call',handleMuteCall)
	  }
	}, [peer,socket,muteCall])
	
	const hangUp=useCallback(async ()=>{
		
		peer.close()
		
		socket.emit('hang-up')
		navigate('/')
	},[])

	const handleHangUp=()=>{
		console.log('user hangup the call')
	}
	
	useEffect(() => {
		socket.on('hang:up',handleHangUp)
	
	  return () => {
		socket.off('hang:up',handleHangUp)
	  }
	}, [peer,hangUp,socket])
	

	return (
		<div className='relative'>
		<div className='h-[90vh] w-full bg-neutral-300'>
			<div className='h-1/2 w-full '>
				
				<video className='h-full w-full' ref={localVideoRef}
					muted
					playsInline
					autoPlay
				></video>
			</div>
			<div className='h-1/2 w-full '>
				
				<video ref={remoteVideoRef}
					muted={muted?true:false}
					playsInline
					autoPlay
				></video>
			</div>
			<div className='h-20 w-full flex items-center justify-evenly'>
				<div className='h-12 w-20 flex items-center justify-center rounded-3xl bg-gray-400' onClick={muteCall} >
					<BsMicMuteFill className='h-10 w-10 ' />
				</div>
				<div className='h-12 w-28 flex items-center justify-center rounded-3xl bg-red-700' onClick={hangUp}>
					<ImPhoneHangUp  className='h-10 w-10' />
				</div>
				<div className='h-12 w-20 flex items-center justify-center rounded-3xl bg-gray-400'>
					<FaVideoSlash   className='h-10 w-10'/>
				</div>
			</div>
			</div>
		</div>
	)
}

export default Confress