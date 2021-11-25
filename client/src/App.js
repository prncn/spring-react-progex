import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import Login from './Login';

export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getPosts();
  }, []);

  async function getPosts() {
    const url = 'http://localhost:8080/api/posts';
    const response = await fetch(url);

    if (!response.ok) {
      const message = `Fetch error has occured: ${response.status}`;
      throw new Error(message);
    }
  
    const data = await response.json();
    setData(data);
  }

  console.log(data);
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
