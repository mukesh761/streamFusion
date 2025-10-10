import React, { useContext, useState } from 'react'
import { socketContext} from '../context/Socket.context'
import { useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import { useCallback } from 'react'

const Home = () => {
    const [roomId, setroomId] = useState('')
    const [password, setpassword] = useState('')
    const {socket}=useContext(socketContext)
    const navigate=useNavigate()

    const handleCreateRoom=(e)=>{
      e.preventDefault()
      const data={roomId,password}
      socket.emit('createRoom',{data,user:JSON.parse(localStorage.getItem('user'))})
      
    }
    const handleJoinRoom=(e)=>{
      e.preventDefault()
      const data={roomId,password}
      socket.emit('joinRoom',{data,user:JSON.parse(localStorage.getItem('user'))})
    }

    const handleRoomCreated=useCallback(({data,email})=>{
      console.log('joining room ',data.roomId);
      navigate(`confress/${data.roomId}`)
    },[])

    const handleRoomJoined=useCallback(({data,email})=>{
      console.log('joined room ',data.roomId,email)
      navigate(`confress/${data.roomId}`)
    })

    useEffect(()=>{
      socket.on('roomCreated',handleRoomCreated)
      socket.on('roomJoined',handleRoomJoined)
      return (()=>{
        socket.off('roomCreated',handleRoomCreated)
        socket.off('roomJoined',handleRoomJoined)
      })
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