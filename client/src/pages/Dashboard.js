import Post from '../components/post';
import React, { useState, useEffect } from 'react';

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

  const placeholder = [
    {
      id: 5,
      author: 'Aretha',
      content: 'A document for you, G',
      date: '2021-11-07 10:57:24.083539',
      url: 'https://www.geschkult.fu-berlin.de/e/khi/_ressourcen/ndl_forum_pdf/rembrandt_symposium_programm.pdf',
      icon: 'https://i.imgur.com/NDFE7BQ.jpg'
    },
    {
      id: 6,
      author: 'Erykah',
      content: 'Some article by yours truly',
      date: '2021-11-08 10:57:24.083539',
      url: 'https://imma.ie/wp-content/uploads/2018/10/whatisconceptualart.pdf',
      icon: 'https://i.imgur.com/Ks2oou4.jpg'
    },
    {
      id: 7,
      author: 'Chitra',
      content: 'Some article by yours truly',
      date: '2021-11-08 10:57:24.083539',
      url: 'https://www.sprengel-museum.de/images/PDF/BIG-short-guide-en.pdf',
      icon: 'https://i.imgur.com/ncnHn9I.jpg'
    },
  ];

  const homeicon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 inline"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  );

  return (
    <div className="flex justify-center min-h-screen bg-white mt-20">
      <div className="w-40 m-4 p-6 h-60 bg-gray-100 rounded text-gray-700 font-semibold text-xl flex flex-col justify-around">
        <div className="inline">Home</div>
        <div>Explore</div>
        <div>Profile</div>
        <div>Settings</div>
        <div>More</div>
      </div>
      <div className="flex flex-col justify-center">
        <h1 className="font-bold text-gray-700 text-3xl mx-2 drop-shadow">Posts</h1>
        <div className="flex flex-col justify-center items-center">
          {placeholder.map((post) => (
            <Post key={post.id} data={post} />
          ))}
        </div>
      </div>
      <div className="w-80 h-96 rounded-lg bg-gray-100 m-4 p-6">
        <h1 className="text-xl font-semibold mb-4">Spaces for you</h1>
        <div className="font-semibold divide-y">
          <p className="py-2">#illustrations</p>
          <p className="py-2">#statistics</p>
        </div>
      </div>
    </div>
  );
}
