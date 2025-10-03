import React, { useContext } from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import SingUp from "./pages/SingUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Confress from "./pages/Confress";
import { userContext } from "./context/User.context";

const App=()=>{
  // const {islogin}=useContext(userContext)
  // console.log(islogin)
  const islogin= localStorage.getItem(islogin)
  console.log(islogin)
  return(
    <Router>
      <Routes>
        
        <Route path="/login" element={islogin?<Home/>:<Login/>} />
        <Route path="/" element={islogin?<Home/>:<Login/>} />
        <Route path="/signup" element={islogin?<Home/>:<SingUp/>}/>
         <Route path="/confress/:roomId" element={islogin?<Confress/>:<Login/>}/>
      </Routes>
    </Router>
  )
}

export default App