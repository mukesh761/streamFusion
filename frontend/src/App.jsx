import React from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import SingUp from "./pages/SingUp";
import Login from "./pages/Login";
import Home from "./pages/Home";

const App=()=>{
  return(
    <Router>
      <Routes>
        
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<Home/>} />
        <Route path="/signup" element={<SingUp/>}/>
      </Routes>
    </Router>
  )
}

export default App