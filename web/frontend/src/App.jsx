import React from 'react';
import Dashboard from './pages/Dashboard'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import Issues from './pages/Issues';
import Home from './pages/Home';


function App() {
  
  return (
   <Routes>
    <Route path="/dashboard" element={<Dashboard/>}/>
    <Route path="/login" element={<LoginPage/>}/>
    <Route path="issues" element={<Issues/>}/>
    <Route path="/home" element={<Home/>}/>
   </Routes>
  )
}

export default App;
