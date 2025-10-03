import React, { useContext, useEffect, useRef, useState } from 'react';
import { peerContext } from '../context/Peer.context';
  
  const Confress = () =>  {
	const [localStream, setlocalStream] = useState();
	const {peer}=useContext(peerContext)
	const localStreamRef=useRef()
	const remoteStreamRef=useRef()

	const handlelocalVideo=async ()=>{
		const stream=await navigator.mediaDevices.getUserMedia({audio:true, video:true})
		if(localStreamRef.current){
			localStreamRef.current.srcObject=stream;
		}
		stream.getTracks().forEach(track=>{
			peer.addTrack(track,stream)
		})
	}
	

	useEffect(() => {
  const handleTrack = (event) => {
    const incomingStream = event.streams;
	console.log(incomingStream)
    if (remoteStreamRef.current) {
      remoteStreamRef.current.srcObject = incomingStream[0];
    }
  };

  peer.addEventListener("track", handleTrack);

  return () => {
    peer.removeEventListener("track", handleTrack);
  };
}, [peer]);

	useEffect(()=>{
		handlelocalVideo()
		
		
  return () => {
    if (localStreamRef.current?.srcObject) {
      localStreamRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };
	},[])

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
  