import React, { useState } from 'react'

const Home = () => {
    const [roomId, setroomId] = useState(null)
    const [password, setpassword] = useState(null)

    const handleJoinRoom=()=>{

    }
    const handleCreateRoom=()=>{

    }
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