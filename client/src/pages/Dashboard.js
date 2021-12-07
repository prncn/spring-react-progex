import '../index.css';
import Post from '../components/post';
import React, { useState, useEffect } from 'react';
import { logout } from '../firebase';
import { useNavigate } from 'react-router';
import { useAuth } from '../firebase';
import { Link } from 'react-router-dom';
import { getPosts } from '../controller/queryService';
import { IconLogout, IconExplore, IconDocs, IconProfile } from '../icons/NavIcons';
import IconHome from '../icons/home';

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [offline, setOffline] = useState(true);
  const currentUser = useAuth();

  useEffect(() => {
    (async () => {
      const data = await getPosts();
      console.log(data);
      setData(data);
    })();
  }, []);

  return (
    <>
      <div className="flex justify-center min-h-screen mt-20 relative">
        <NavTab />
        <div className="flex flex-col justify-center">
          <p className="text-gray-500">Hi, {currentUser?.email}</p>
          <div className="flex flex-col justify-center items-center">
            <PostCreator />
            <h1 className="font-bold text-gray-700 text-3xl self-start">
              Posts
            </h1>
            {data.map((post) => (
              <Post key={post.id} data={post} offline={offline} />
            ))}
          </div>
        </div>
        <SpacesTab
          spaces={['distributedsystems', 'illustrations', 'fashion']}
        />
      </div>
    </>
  );
}

function PostCreator() {
  return (
    <div className="w-full h-40 flex rounded-lg bg-indigo-400 py-2 my-6">
      <div className="w-20 pl-4">
        <div className="w-16 h-16 mt-2 rounded-full">
          <img
            className="w-full h-full object-contained rounded-full block shadow-lg"
            src="https://i.imgur.com/ncnHn9I.jpg"
            alt="pfp_icon"
          />
        </div>
      </div>
      <form className="w-full h-full m-1 px-3 flex flex-col">
        <input className="bg-indigo-400 w-3/4 p-1 text-gray-50 placeholder-gray-300 font-semibold text-lg focus:outline-none" placeholder="Title your Doc..."></input>
        <input className="bg-indigo-400 w-3/4 p-1 text-gray-50 placeholder-gray-300 text-sm focus:outline-none h-auto" placeholder="URL to your Doc..."></input>
        <button className="bg-gray-100 text-black font-semibold px-5 py-2 rounded-full self-end"><span>Send.</span></button>
      </form>
    </div>
  );
}

function NavTab() {
  const navigate = useNavigate();

  async function handleLogout(e) {
    e.preventDefault();

    try {
      await logout();
      navigate('/signup');
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <div className="w-50 pr-10 h-96 flex flex-col">
      <div className="flex flex-col text-left text-gray-600 text-xl">
        <div className="text-3xl font-semibold text-indigo-400 mb-5">
          Murdoc.
        </div>
        <button className="dashboard-nav__btn">
          <IconHome/>
          <span>Home</span>
        </button>
        <button className="dashboard-nav__btn">
          <IconExplore/>
          <span>Explore</span>
        </button>
        <button className="dashboard-nav__btn">
          <IconDocs/>
          <span>Docs</span>
        </button>
        <Link to="/update-profile">
          <button className="dashboard-nav__btn">
            <IconProfile/>
            <span>Profile</span>
          </button>
        </Link>
        <button onClick={handleLogout} className="dashboard-nav__btn">
          <IconLogout/>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

function SpacesTab({ spaces }) {
  return (
    <div className="w-80 h-96 rounded-lg bg-gray-50 m-4 p-6">
      <h1 className="text-xl font-semibold mb-4">Spaces for you</h1>
      <div className="font-semibold divide-y">
        {spaces.map((space) => (
          <div className="py-3">
            <p>#{space}</p>
            <p className="font-light text-sm">4124 Docs in this Space</p>
          </div>
        ))}
      </div>
    </div>
  );
}
