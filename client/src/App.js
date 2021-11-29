import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';

export default function App() {
  
  return (
    <div className="h-screen">
      <Router>
        <Routes>
          <Route path="/dash" element={<Dashboard />} />
          <Route path="/" element={<Signup/>} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </Router>
    </div>
  );
}