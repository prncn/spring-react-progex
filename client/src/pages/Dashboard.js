import '../index.css';
import Post from '../components/post';
import React, { useState, useEffect, createRef } from 'react';
import { logout, useAuth } from '../controller/Firebase';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { createPost, getPosts, placeholder } from '../controller/queryService';
import {
  IconLogout,
  IconExplore,
  IconDocs,
  IconProfile,
} from '../icons/NavIcons';
import IconHome from '../icons/home';

export default function Dashboard() {
  const [data, setData] = useState(placeholder);
  const [offline, setOffline] = useState(true);
  const currentUser = useAuth();
  console.log(currentUser);
  console.log(offline);

  useEffect(() => {
    (async () => {
      const [data, responded] = await getPosts();
      console.log(data);
      setData(data);
      if (responded !== null) {
        setOffline(false);
      }
    })();
  }, []);

  return (
    <>
      <div className="flex justify-center min-h-screen mt-10 relative">
        <NavTab />
        <div className="flex flex-col justify-center">
          <p className="text-gray-500">Hi, {currentUser?.displayName}</p>
          <div className="flex flex-col justify-center items-center">
            <PostCreator currentUser={currentUser} />
            <h1 className="font-bold text-gray-700 text-3xl self-start">
              Posts
            </h1>
            {data.map((post, i) => (
              <Post key={post.id} data={post} idn={i}/>
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

function PostCreator({ currentUser }) {
  const contentRef = createRef();
  const urlRef = createRef();
  const pfpIcon = currentUser?.photoURL;

  function handleSubmit(e) {
    e.preventDefault();
    createPost(
      currentUser,
      contentRef.current.value,
      pfpIcon,
      urlRef.current.value
    );
  }

  return (
    <div className="w-full h-40 flex rounded-lg bg-indigo-400 p-3 my-6">
      <div className="w-20">
        <div className="w-16 h-16 mt-2 rounded-full">
          <img
            className="w-full h-full object-contained rounded-full block shadow-lg"
            src={pfpIcon}
            alt="pfp_icon"
          />
        </div>
      </div>
      <form className="w-full h-full flex flex-col">
        <input
          ref={contentRef}
          className="bg-indigo-400 w-3/4 p-1 text-gray-50 placeholder-gray-300 font-semibold text-lg focus:outline-none"
          placeholder="Title your Doc..."
        ></input>
        <input
          ref={urlRef}
          className="bg-indigo-400 w-3/4 p-1 text-gray-50 placeholder-gray-300 text-sm focus:outline-none h-auto"
          placeholder="URL to your Doc..."
        ></input>
        <button
          onClick={handleSubmit}
          className="bg-gray-100 text-black font-semibold px-5 py-2 rounded-full place-self-end mt-auto"
        >
          <span>Send.</span>
        </button>
      </form>
    </div>
  );
}

export function NavTab() {
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
        <div className="text-3xl font-semibold text-indigo-400 mb-5 cursor-pointer">
          Murdoc.
        </div>
        <Link to="/dash">
          <button className="dashboard-nav__btn">
            <IconHome />
            <span>Dash</span>
          </button>
        </Link>
        <button className="dashboard-nav__btn">
          <IconExplore />
          <span>Explore</span>
        </button>
        <button className="dashboard-nav__btn">
          <IconDocs />
          <span>Docs</span>
        </button>
        <Link to="/profile">
          <button className="dashboard-nav__btn">
            <IconProfile />
            <span>Profile</span>
          </button>
        </Link>
        <button onClick={handleLogout} className="dashboard-nav__btn">
          <IconLogout />
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
        {spaces.map((space, i) => (
          <div className="py-3" key={i}>
            <p>#{space}</p>
            <p className="font-light text-sm">4124 Docs in this Space</p>
          </div>
        ))}
      </div>
    </div>
  );
}
