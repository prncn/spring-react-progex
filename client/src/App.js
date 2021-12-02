import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import UpdateProfile from './pages/UpdateProfile';
import Home from './pages/Home';

export default function App() {
  return (
    <div className="h-screen">
      <Router>
        <Routes>
          <Route path="/dash" element={<Dashboard />} />
          <Route path="/" element={<Signup/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/forgot-password" element={<ResetPassword/>} />
          <Route path="/update-profile" element={<UpdateProfile/>} />
          <Route path="/" element={<Home form="signup"/>} />
          <Route path="/login" element={<Home form="login"/>} />
        </Routes>
      </Router>
    </div>
  );
}
