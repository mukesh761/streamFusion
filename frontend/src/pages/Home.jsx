import React, { useContext, useState } from 'react'
import { socketContext} from '../context/Socket.context'
import { useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import { useCallback } from 'react'
import {motion} from 'motion/react'
import Host from '../components/Host'
import Join from '../components/Join'

//importing components 
import Navbar from '../components/Navbar'

const Home = () => {
    const [roomId, setroomId] = useState('')
    const [password, setpassword] = useState('')
    const [showhost, setshowhost] = useState(false)
    const [showjoin, setshowjoin] = useState(false)
    const {socket}=useContext(socketContext)
    const navigate=useNavigate()

    
   

    

    

   
  return (
    <div className='h-screen  w-screen'>
    <Navbar/>
    <div className=' h-2/3 flex flex-col z-0 items-center justify-center'>
    {showhost && <Host setshowhost={setshowhost}/>}
    {showjoin && <Join setshwohost={setshowjoin}/>}
       <div className='p-10 flex items-center justify_center w-full h-full'>
       <h1 className='text-2xl text-blue-500 font-semibold text-center'>Welcome to the the <span className='text-3xl text-shadow-blue-300 text-blue-700 font-bold text-shadow-[5px_5px_5px_black]'>StreamFusion</span> where you can manage your meetings through the videocall and chat. you can share your screen and also stream it to the different platforms like the youtube, facebook and instagram . Everything at one place </h1>

       </div>
       <div className='flex gap-10 flex-col md:flex-row'>
        <motion.button 
        onClick={()=>setshowhost(true)}
        initial={{opacity:0,x:-100 , y:100}}
        whileInView={{opacity:1,x:0, y:0}}
        transition={{duration:0.5,delay:0.2}}
        className='h-10 w-52 bg-blue-400 shadow-[5px_5px_10px_gray] rounded-md cursor-pointer hover:bg-blue-200 font-semibold text-xl'>host a meeting</motion.button>
        <motion.button 
        onClick={()=>setshowjoin(true)}
        initial={{opacity:0,x:-100 , y:100}}
        whileInView={{opacity:1,x:0, y:0}}
        transition={{duration:0.5,delay:0.2}}
        className='h-10 w-52 bg-blue-400 shadow-[5px_5px_10px_gray] rounded-md cursor-pointer hover:bg-blue-200 text-xl font-semibold '>join a meeting</motion.button>
        
       </div>
    </div>
   </div>
  )
}

export default Home