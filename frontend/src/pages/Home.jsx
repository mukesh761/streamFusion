import React, { useContext, useEffect, useState } from 'react'
 
  import { socketContext } from '../context/Socket.context'
import { useNavigate } from 'react-router-dom'
import { peerContext } from '../context/Peer.context'

const Home = () => {
    const [roomId, setroomId] = useState('')
    const [password, setpassword] = useState('')
    const {socket}=useContext(socketContext)
    const {createOffer , createAnswer, addAnswer}=useContext(peerContext)
    const navigate=useNavigate()
    

    const handleCreateRoom=()=>{
      const data={roomId,password}
      socket.emit('createRoom',{data,user:JSON.parse(localStorage.getItem('user'))})
      console.log('creating room')
    }
    const handleJoinRoom=()=>{
      const data={roomId,password}
      console.log('joining room ',roomId)
      socket.emit('joinRoom',{data,user:JSON.parse(localStorage.getItem('user'))})
    }
    const handleRoomCreated=({data, email})=>{
      console.log(`room created ${data.roomId} by ${email}`)
      navigate(`confress/${data.roomId}`)
    }

    const handleRoomJOined=async ({data,email})=>{
      console.log('new user Joined room ',data,email)
       navigate(`confress/${data.roomId}`)
     
      
    }
    

    useEffect(()=>{
      socket.on('roomCreated',handleRoomCreated)
      socket.on('roomJoined',handleRoomJOined)
    
     
      return()=>{
        
        socket.off('roomCreated',handleRoomCreated)
        socket.off('roomJoined',handleRoomJOined)
        
      
      }
    },[socket])
  return (
    <div className='flex items-center justify-center h-screen w-screen flex-col gap-2'>
        <input type="text"
			 className='h-10 w-96 border-2 p-2' 
			 placeholder='enter roomId'
			 value={roomId}
			 onChange={(e)=>{setroomId(e.target.value)}}
			  />
               <input type="text"
			 className='h-10 w-96 border-2 p-2' 
			 placeholder='enter password'
			 value={password}
			 onChange={(e)=>{setpassword(e.target.value)}}
			  />
              <button className='h-10 w-52 border-2 rounded-md bg-blue-300'
			onClick={handleCreateRoom}
			>create room</button>
            <button className='h-10 w-52 border-2 rounded-md bg-blue-300'
			onClick={handleJoinRoom}
			>join Room</button>
    </div>
  )
}

export default Home