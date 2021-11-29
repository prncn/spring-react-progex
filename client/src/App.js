import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';

export default function App() {
  return (
    <div className="h-screen">
      <Router>
        <Routes>
          <Route path="/dash" element={<Dashboard />} />
          <Route path="/" element={<Home form="signup"/>} />
          <Route path="/login" element={<Home form="login"/>} />
        </Routes>
      </Router>
    </div>
  );
}
