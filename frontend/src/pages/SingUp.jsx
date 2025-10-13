import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { backendUrl } from '../../utils/utils';
import axios from 'axios';
import { userContext } from '../context/User.context';
import {motion} from 'motion/react'
import welcomeimage from '../assets/visuals-ufK-deiLqY8-unsplash.jpg'
import { FaGoogle } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";

const SingUp = () => {
    
      const [name,setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {setislogin,setuser}=useContext(userContext)

  const navigate = useNavigate();

  const handleSignup =async (e) => {
    e.preventDefault();
  try {
      const data={name,username,email,password};
    const response= await axios.post(`${backendUrl}/user/signup`,data,{withCredentials: true});
    console.log(response.data);
      setislogin(true);
      setuser(response.data.newUser);
      localStorage.setItem("islogin", true);
      localStorage.setItem("user", JSON.stringify(response.data.newUser));
      navigate("/");
    
  } catch (error) {
    if(error){
      console.log(error)
    }
  }
  }
  return (
    <div>
   <div className='md:flex items-center justify-center gap-10  bg-gray-100 p-10 flex flex-col md:flex-row min-h-screen '>
    <div className='left md:w-[50%]'>
      

    <div>  <h1 className='text-2xl'>StreamFusion is your all-in-one platform for live video chatting and seamless <span className='text-blue-600 text-3xl font-extrabold text-shadow-[2px_2px_5px_black]'>streaming</span> to platforms like <span className='text-blue-600 text-3xl font-extrabold text-shadow-[2px_2px_5px_black]'>YouTube</span> . </h1></div>
    <motion.div
       initial={{opacity:0,x:-100 , y:100}}
       animate={{opacity:1,x:0, y:0}}
       transition={{duration:0.5,delay:0.2}}
       className='mt-10 shadow-[5px_5px_15px_rgba(0,0,0,1)]'
         >
        <img src={welcomeimage} alt="" />
      </motion.div>
    </div>
    <motion.div
    initial={{opacity:0,x:100 , y:100}} 
    whileInView={{opacity:1,x:0, y:0}}
     className='right md:w-[50%] flex items-center justify-center flex-col gap-2 h-full'>
      <div className='w-3/4'>
        <form action="" className='h-full w-full'>
          <h1 className='text-3xl text-center mb-10 text-blue-400 text-shadow-[2px_2px_5px_black] font-extrabold'>Be a part of our family</h1>
          <div className='flex flex-col gap-4'>
            <input type="text" placeholder='Full name' value={name} onChange={(e)=>{setName(e.target.value)}} className='border border-gray-300 rounded-md p-2' />
            <input type="text" placeholder='Username' value={username} onChange={(e)=>{setUsername(e.target.value)}} className='border border-gray-300 rounded-md p-2' />
            <input type="email" placeholder='Email' value={email} onChange={(e)=>{setEmail(e.target.value)}} className='border border-gray-300 rounded-md p-2' />
            <input type="password" placeholder='Password' value={password} onChange={(e)=>{setPassword(e.target.value)}} className='border border-gray-300 rounded-md p-2' />
            <input type="submit" className='bg-blue-500 text-white rounded-md p-2 shadow-[3px_3px_10px_rgba(0,0,0,1)]' onClick={(e)=>{handleSignup(e)}} />
          </div>
        </form>
      </div>
      <div>
        <p>or login with</p>
        <div className='flex items-center justify-center gap-4'>
          <div className='h-10 w-10 bg-blue-400 flex items-center justify-center rounded-full hover:h-12 hover:w-12 transition-all shadow-[3px_3px_10px_rgba(0,0,0,1)]'><FaGoogle className='text-white' />
          </div>
          <div className='h-10 w-10 bg-blue-400 flex items-center justify-center rounded-full hover:h-12 hover:w-12 transition-all shadow-[3px_3px_10px_rgba(0,0,0,1)] '><FaFacebookF  className='text-white'/>
          </div>
        </div>
        <h1>Already have an account?<span className='hover:cursor-pointer text-blue-400 ml-2'onClick={()=>{navigate("/login")}}>Login</span></h1>
        </div>
    </motion.div>
    </div>
    
   </div>
  )
}

export default SingUp