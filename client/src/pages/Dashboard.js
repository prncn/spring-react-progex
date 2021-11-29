import Post from "../components/post";
import React, { useState, useEffect } from "react";
import { logout } from "../firebase";
import { Navigate, useNavigate } from "react-router";

export default function Dashboard() {
  // const [data, setData] = useState([]);

  // useEffect(() => {
  //   getPosts();
  // }, []);

  // async function getPosts() {
  //   const url = 'http://localhost:8080/api/posts';
  //   const response = await fetch(url);

  //   if (!response.ok) {
  //     const message = `Fetch error has occured: ${response.status}`;
  //     throw new Error(message);
  //   }

  //   const data = await response.json();
  //   setData(data);
  // }


  const [error, setError] = useState("")
  const navigate = useNavigate();

  async function handleLogout(e) {

    e.preventDefault();

    try {
      setError('')
      await logout()
      navigate('/signup')
    }catch {
      setError('Failed to log out')
      alert('Filed to logout')
    }

  }


  const placeholder = [
    {
      id: 5,
      author: "Aretha",
      content: "A document for you, G",
      date: "2021-11-07 10:57:24.083539",
      url: "https://www.geschkult.fu-berlin.de/e/khi/_ressourcen/ndl_forum_pdf/rembrandt_symposium_programm.pdf",
      icon: "https://i.imgur.com/NDFE7BQ.jpg",
    },
    {
      id: 6,
      author: "Erykah",
      content: "Some article by yours truly",
      date: "2021-11-08 10:57:24.083539",
      url: "https://imma.ie/wp-content/uploads/2018/10/whatisconceptualart.pdf",
      icon: "https://i.imgur.com/Ks2oou4.jpg",
    },
    {
      id: 7,
      author: "Chitra",
      content: "Some article by yours truly",
      date: "2021-11-08 10:57:24.083539",
      url: "https://www.sprengel-museum.de/images/PDF/BIG-short-guide-en.pdf",
      icon: "https://i.imgur.com/ncnHn9I.jpg",
    },
  ];

  return (
    <div>
    <div className="flex justify-center min-h-screen mt-20 relative">
      <div className="w-50 m-4 p-4 pr-10 h-96 bg-gray-700 rounded text-gray-100 text-xl flex flex-col justify-start shadow-lg">
        <div className="flex flex-col text-left">
          <button className="text-left font-semibold">Home</button>
          <button className="text-left">Explore</button>
          <button className="text-left">Profile</button>
          <button className="text-left">Settings</button>
          <button className="text-left">More</button>
        </div>
      </div>
      <div className="flex flex-col justify-center -mt-7">
        <h1 className="font-bold text-gray-700 text-3xl mx-2">
          Posts
        </h1>
        <div className="flex flex-col justify-center items-center">
          {placeholder.map((post) => (
            <Post key={post.id} data={post} />
            ))}
        </div>
      </div>
      <div className="w-80 h-96 rounded-lg bg-gray-50 m-4 p-6">
        <h1 className="text-xl font-semibold mb-4">Spaces for you</h1>
        <div className="font-semibold divide-y">
          <p className="py-2">#illustrations</p>
          <p className="py-2">#statistics</p>
        </div>
      </div>
    </div>
    </div>
  );
}
