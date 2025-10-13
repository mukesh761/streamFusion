import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import SingUp from "./pages/SingUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Confress from "./pages/Confress";
import { userContext } from "./context/User.context";

const App = () => {
  const {islogin ,setislogin}=useContext(userContext)
  useEffect(() => {
    const loggedIn=(localStorage.getItem("islogin"));
    setislogin(loggedIn)

  }, [islogin])

  return (
    <Router>
      <Routes>

        <Route path="/login" element={islogin ? <Home /> : <Login />} />
        <Route path="/" element={islogin ? <Home /> : <Login  />} />
        <Route path="/signup" element={<SingUp />} />
        <Route path="/confress/:roomId" element={<Confress />} />
      </Routes>
    </Router>
  )
}

export default App