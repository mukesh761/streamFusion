import React, { useContext, useRef, useState } from 'react';
import { peerContext } from '../context/Peer.context';
  
  const Confress = () =>  {
	const [localStream, setlocalStream] = useState();
	const {peer,}=useContext(peerContext)
	const localStreamRef=useRef()
	return (
	  <div>
		<div >
			<video src={localStream}
			ref={localStreamRef}
			></video>
		</div>
	  </div>
	);
  }
  
  export default Confress;
  