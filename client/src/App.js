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
    <div
      className="flex justify-center items-center min-h-screen bg-blue-50"
    >
      <div className="flex flex-col justify-center">
        <h1 className="font-bold text-2xl mx-2 drop-shadow">Posts</h1>
        <div className="flex justify-center items-center">
          {data.map((post) => (
            <Post key={post.id} data={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
