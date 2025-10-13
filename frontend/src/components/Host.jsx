import React, { useContext, useState, useEffect, useCallback } from 'react'
import { RxCross1 } from "react-icons/rx";
import { socketContext } from '../context/Socket.context';
import { useNavigate } from 'react-router-dom';


const Host = ({ setshowhost }) => {
    const [password, setpassword] = useState("");
    const [roomId, setroomId] = useState("");
    const { socket } = useContext(socketContext)
    const navigate = useNavigate()

    const generateRoomId=()=>{
        const value='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let roomId=''
        for (let i=0; i<4; i++){
            let ranIndex= Math.floor(Math.random()* value.length)
            roomId+=value[ranIndex]
        }
        setroomId(roomId)
    }

    const handleCreateRoom = (e) => {
        e.preventDefault()
        const data = { roomId, password }
        socket.emit('createRoom', { data, user: JSON.parse(localStorage.getItem('user')) })
    }

    const handleRoomCreated = useCallback(({ data, email }) => {
        console.log('joining room ', data.roomId);
        navigate(`confress/${data.roomId}`)
    }, [])

    useEffect(()=>{
        socket.on('roomCreated',handleRoomCreated)
        return (()=>{
            socket.off('roomCreated',handleRoomCreated)
        })
    },[socket])

    useEffect(()=>{
        generateRoomId()
    },[])

    return (
        <div className='mt-24 h-4/5 z-10 l shadow-[5px_5px_10px_gray] absolute bg-gray-100 flex items-center justify-center w-2/3 flex-col '>
            <div className='h-7 w-7 absolute top-10 right-10 bg-red-200 flex items-center justify-center' onClick={() => { setshowhost(false) }}><RxCross1 className='cursor-pointer h-10 w-5 font-bold text-shadow-[5px_5px_10px]' /></div>
            <h1 className='text-2xl font-bold text-shadow-[2px_2px_5px]'>create a new room</h1>
            <div>
                <h1 className='text-xl text-center mb-10 '>Room {roomId}</h1>
                <form onSubmit={handleCreateRoom} className='flex flex-col items-center justify-center gap-5'>
                    <input type="text" placeholder='enter your room password' value={password} onChange={(e) => { setpassword(e.target.value) }} className='h-10 border-[0px_0px_4px_0px] shadow-[5px_5px_10px_black]  ' />
                    <input type="submit" value="create room" className='bg-blue-400 h-10 w-32 rounded hover:bg-blue-200 cursor-pointer' />
                </form>
            </div>
        </div>
    )
}

export default Host