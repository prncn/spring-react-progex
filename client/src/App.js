import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

export default function App() {
  
  return (
    <div className="h-screen bg-gray-100">
      <Router>
        <Routes>
          <Route path="/dash" element={<Dashboard />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}
