import Post from './Post';
import React, { useState, useEffect } from 'react';

export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getPosts();
  }, []);

  async function getPosts() {
    const url = 'http://localhost:5000/api/posts';
    const response = await fetch(url);
    const data = await response.json();
    setData(data);
  }

  console.log(data);
  return (
    <div className="App">
      <div
        className="App-header d-flex justify-content-center align-items-center min-vh-100"
        style={{ backgroundColor: 'aliceblue' }}
      >
        { data.map(post => (
          <Post key={post.id} data={post}/>
        )) }
      </div>
    </div>
  );
}
