import React, { useCallback, useContext, useEffect, useState } from 'react'
import { RxCross1 } from "react-icons/rx";
import { socketContext } from '../context/Socket.context';
import { useNavigate } from 'react-router-dom';




const Join = ({ setshwohost }) => {

    const [roomId, setroomId] = useState("");
    const [password, setpassword] = useState("");
    const { socket } = useContext(socketContext)
    const navigate = useNavigate()

    const handleJoinRoom = (e) => {
        e.preventDefault()
        const data = { roomId, password }
        socket.emit('joinRoom', { data, user: JSON.parse(localStorage.getItem('user')) })
    }

    const handleRoomJoined = useCallback(({ data, email }) => {
        console.log('joined room ', data.roomId, email)
        navigate(`confress/${data.roomId}`)
    })

    useEffect(()=>{
        socket.on('roomJoined',handleRoomJoined)
        return (()=>{
            socket.off('roomJoined',handleRoomJoined)
        })
    })

    return (
        <div className='mt-24 h-4/5 z-10 l shadow-[5px_5px_10px_gray] absolute bg-gray-100 flex items-center justify-center w-2/3 flex-col '>
            <div className='h-7 w-7 absolute top-10 right-10 bg-red-200 flex items-center justify-center' onClick={() => { setshwohost(false) }}><RxCross1 className='cursor-pointer h-10 w-5 font-bold text-shadow-[5px_5px_10px]' /></div>
            <h1 className='text-2xl font-bold text-shadow-[2px_2px_5px] mb-10'>Join a room</h1>
            <div>

                <form onSubmit={handleJoinRoom} className='flex flex-col items-center justify-center gap-5'>
                    <input type="text" placeholder='Enter Room Id' value={roomId} onChange={e => { setroomId(e.target.value) }} className='h-10 border-[0px_0px_4px_0px] shadow-[5px_5px_10px_black]  ' />
                    <input type="tehandleIncomingCallxt" placeholder='Enter Room Password' value={password} onChange={e => { setpassword(e.target.value) }} className='h-10 border-[0px_0px_4px_0px] shadow-[5px_5px_10px_black]  ' />
                    <input type="submit" value="Join Room" className='bg-blue-400 h-10 w-32 rounded hover:bg-blue-200 cursor-pointer' />
                </form>
            </div>
        </div>
    )
}

export default Join