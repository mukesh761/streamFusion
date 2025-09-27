import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { backendUrl } from '../../utils/utils';
import axios from 'axios';
import { userContext } from '../context/User.context';

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
        <form action="" className='flex items-center justify-center h-screen w-screen flex-col gap-2'>
           <input type="text"
			 className='h-10 w-96 border-2 p-2' 
			 placeholder='enter name'
			 value={name}
			 onChange={(e)=>{setName(e.target.value)}}
			  />
               <input type="text"
			 className='h-10 w-96 border-2 p-2' 
			 placeholder='enter username'
			 value={username}
			 onChange={(e)=>{setUsername(e.target.value)}}
			  />
               <input type="email"
			 className='h-10 w-96 border-2 p-2' 
			 placeholder='enter email'
			 value={email}
			 onChange={(e)=>{setEmail(e.target.value)}}
			  />
               <input type="password"
			 className='h-10 w-96 border-2 p-2' 
			 placeholder='enter password'
			 value={password}
			 onChange={(e)=>{setPassword(e.target.value)}}
			  />
			  <button className='h-10 w-52 border-2 rounded-md bg-blue-300'
			onClick={handleSignup}
			>login</button>
        </form>
    </div>
  )
}

export default SingUp