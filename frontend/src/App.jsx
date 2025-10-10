import React from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import SingUp from "./pages/SingUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Confress from "./pages/Confress";

const App=()=>{
  return(
    <Router>
      <Routes>
        
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<Home/>} />
        <Route path="/signup" element={<SingUp/>}/>
        <Route path="/confress/:roomId" element={<Confress/>} />
      </Routes>
    </Router>
  )
}

export default App