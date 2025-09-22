import React from 'react';
import Dashboard from './pages/Dashboard'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import Issues from './pages/Issues';
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';
import Workers from './pages/Workers';



function App() {
  
  return (
   <Routes>
    <Route path="/dashboard" element={<Dashboard/>}/>
    <Route path="/login" element={<LoginPage/>}/>
    <Route path="issues" element={<Issues/>}/>
    <Route path="/home" element={<Home/>}/>
    <Route path="/" element={<LandingPage/>}/>
    <Route path="/workers" element={<Workers/>}/>
   </Routes>
  )
}

export default App;
