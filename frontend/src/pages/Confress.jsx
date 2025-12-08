import React, { useCallback, useContext, useEffect, useRef } from 'react'
import { peerContext } from '../context/Peer.context'
import { socketContext } from '../context/Socket.context'
import { useParams } from 'react-router-dom'

const Confress = () => {
	const localVideoRef = useRef()
	const remoteVideoRef = useRef()
	const { peer, createOffer, createAnswer, addAnswer } = useContext(peerContext)
	const { socket } = useContext(socketContext)
	const { roomId } = useParams()
	console.log(roomId)
	console.log('socket. io ', socket.connected)
	const candidateQueue = useRef([]);

	const makeCall = () => {
		openCamera()
	}

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
		openCamera()
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

	return (
		<div>
			<div>
				<h1>local video </h1>
				<video ref={localVideoRef}
					muted
					playsInline
					autoPlay
				></video>
			</div>
			<div>
				<h1>Remote  video </h1>
				<video ref={remoteVideoRef}
					muted
					playsInline
					autoPlay
				></video>
			</div>
			<button onClick={makeCall}>makecall</button>
		</div>
	)
}

export default Confress