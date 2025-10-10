import React from 'react';
import { useContext } from 'react';
import { useEffect } from 'react';
import { socketContext } from '../context/Socket.context';

  
  const Confress = () =>  {
	const {socket}=useContext(socketContext)
	useEffect(()=>{
		socket.on('newUser',({email})=>{
			socket.emit('makeCall')
		})
	})

	return (
	  <div>
		Confress room
	  </div>
	);
  }
  
  export default Confress;
  