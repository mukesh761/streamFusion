import React, { useContext, useState } from 'react';
import axios from 'axios'
import { backendUrl } from '../../utils/utils';
import { userContext } from '../context/User.context';
import { useNavigate } from 'react-router-dom';
  
  const Login = () =>  {
	const [email, setemail] = useState('')
	const [password, setpassword] = useState('')
	const {islogin,setislogin, user,setuser}=useContext(userContext)
	const navigate=useNavigate()

	const handleLogin =async  (e) => {
    e.preventDefault();
   try {
     const data={ email:email, password:password }
    const response= await axios.post(`${backendUrl}/user/login`,data,{withCredentials: true});
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
  };
	return (
	  <div className='flex items-center justify-center h-screen w-screen flex-col gap-2'>
		
			<input type="email"
			 className='h-10 w-96 border-2 p-2' 
			 placeholder='enter email'
			 value={email}
			 onChange={(e)=>{setemail(e.target.value)}}
			  />

			<input type="password" className='h-10 w-96 border-2 p-2' placeholder='enter password'
			value={password}
			 onChange={(e)=>{setpassword(e.target.value)}} />
			<button className='h-10 w-52 border-2 rounded-md bg-blue-300'
			onClick={handleLogin}
			>login</button>
		
	  </div>
	);
  }
  
  export default Login;
  