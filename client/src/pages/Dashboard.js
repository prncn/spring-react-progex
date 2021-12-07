import '../index.css';
import Post from '../components/post';
import React, { useState, useEffect } from 'react';
import { logout } from '../firebase';
import { useNavigate } from 'react-router';
import { useAuth } from '../firebase';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    /**
     * Gets all posts from rest API
     */
    async function fetchPosts() {
      const url = 'http://localhost:8080/api/posts/';
      try {
        const response = await fetch(url);
        const data = await response.json();
        setOffline(false);
        setData(data);
      } catch (error) {
        const message = `Fetch error has occured: ${error}`;
        setData(placeholder);
        setOffline(true);
        console.log(message);
      }
    }
    fetchPosts();
  }, []);


  const [error, setError] = useState('');
  const navigate = useNavigate();
  const currentUser = useAuth();

  async function handleLogout(e) {
    e.preventDefault();

    try {
      setError('');
      await logout();
      navigate('/signup');
    } catch {
      setError('Failed to log out');
      alert(error);
    }
  }

  const placeholder = [
    {
      id: 5,
      authorId: 'Offline',
      content: 'A document for you, G',
      date: '2021-11-07 10:57:24.083539',
      url: 'https://www.geschkult.fu-berlin.de/e/khi/_ressourcen/ndl_forum_pdf/rembrandt_symposium_programm.pdf',
      icon: 'https://i.imgur.com/NDFE7BQ.jpg',
    },
    {
      id: 6,
      authorId: 'Erykah',
      content: 'Some article by yours truly',
      date: '2021-11-08 10:57:24.083539',
      url: 'https://imma.ie/wp-content/uploads/2018/10/whatisconceptualart.pdf',
      icon: 'https://i.imgur.com/Ks2oou4.jpg',
    },
    {
      id: 7,
      authorId: 'Chitra',
      content: 'Some article by yours truly',
      date: '2021-11-08 10:57:24.083539',
      url: 'https://www.sprengel-museum.de/images/PDF/BIG-short-guide-en.pdf',
      icon: 'https://i.imgur.com/ncnHn9I.jpg',
    },
  ];

  return (
    <>
      <div>current user is {currentUser?.email}</div>
      <Link to="/update-profile">Update Profile</Link>
      <button onClick={handleLogout} type="button">
        Log Out
      </button>
      <div className="flex justify-center min-h-screen mt-20 relative">
        <div className="w-50 m-4 pr-10 h-96 rounded flex flex-col justify-start">
          <div className="flex flex-col text-left text-gray-600 text-2xl">
            <button className="dashboard-nav__btn">Home</button>
            <button className="dashboard-nav__btn">Explore</button>
            <button className="dashboard-nav__btn">Profile</button>
            <button className="dashboard-nav__btn">Settings</button>
            <button className="dashboard-nav__btn">More</button>
          </div>
        </div>
        <div className="flex flex-col justify-center -mt-7">
          <h1 className="font-bold text-gray-700 text-3xl mx-2">Posts</h1>
          <div className="flex flex-col justify-center items-center">
            {data.map((post) => (
              <Post key={post.id} data={post} offline={offline} />
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
    </>
  );
}
