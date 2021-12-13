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
      <div className="flex min-h-screen">
        <NavTab currentUser={currentUser} />
        <div className="flex flex-col justify-center">
          <div className="flex flex-col justify-center items-center divide-y px-4">
            <PostCreator currentUser={currentUser} />
            <h1 className="font-bold text-gray-600 text-3xl text-left w-full">
              Posts
            </h1>
            {data.map((post, i) => (
              <Post key={post.id} data={post} idn={i} />
            ))}
          </div>
        </div>
        <SpacesTab
          spaces={['distributedsystems', 'illustrations', 'fashion']}
        />
      </div>
  );
}

function PostCreator({ currentUser }) {
  const contentRef = createRef();
  const urlRef = createRef();
  const pfpIcon = currentUser?.photoURL;
  const [show, setShow] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    createPost(
      currentUser,
      contentRef.current.value,
      pfpIcon,
      urlRef.current.value
    );
  }

  function handleReveal(e) {
    e.preventDefault();
    if (!show) {
      setShow(true);
    }
  }

  return (
    <div
      onClick={handleReveal}
      className="w-full h-40 flex rounded-lg bg-indigo-400 p-3 mb-6 bg-post-img"
    >
      <div
        className={
          show ? 'hidden' : 'self-end w-1/3 text-3xl text-white font-semibold'
        }
      >
        Hi, {currentUser?.displayName}. ✋ <br />{' '}
        <p className="font-light"> Share your docs here. </p>
      </div>
      <div
        className={show ? 'visible relative w-full h-full flex' : 'invisible'}
      >
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
            className="bg-gray-100 text-black font-semibold px-5 py-2 rounded-full place-self-end mt-auto hover:bg-gray-200"
          >
            <span>Send.</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export function NavTab({ currentUser }) {
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
    <div className="sticky w-1/3 left-0 border h-screen top-0 flex flex-col">
      <div className="w-72 h-24 border rounded-lg m-4 ml-auto flex p-3">
        <div className="w-16 h-16 rounded-full">
          <img
            className="w-full h-full object-contained rounded-full"
            src={currentUser?.photoURL}
            alt="pfp_icon"
          />
        </div>
        <div className="ml-2">
          <p>
            {new Date().toLocaleTimeString('en-GB', {
              hour: 'numeric',
              minute: 'numeric',
            })}
          </p>
          <p>{currentUser?.email}</p>
          <p>{currentUser?.displayName}</p>
        </div>
      </div>
      <div className="flex flex-col items-end mx-4 mb-auto">
        <div className="flex flex-col w-72 text-left text-gray-600 text-xl">
          <Link to="/dash">
            <button className="dashboard-nav__btn">
              <IconHome />
              <span>Dash</span>
            </button>
          </Link>
          <Link to="/spaces">
            <button className="dashboard-nav__btn border">
              <IconExplore />
              <span>Spaces</span>
            </button>
          </Link>
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
      <div className="m-4 font-semibold text-3xl ml-auto mt-auto">Murdoc.</div>
    </div>
  );
}

function SpacesTab({ spaces }) {
  return (
    <div className="sticky top-0 min-h-screen w-1/3 h-full right-0 border">
      <div className="w-80 h-96 rounded-lg border m-4 py-6 right-20">
        <h1 className="text-xl font-semibold mb-4 pl-6">Spaces for you</h1>
        <div className="font-semibold divide-y">
          {spaces.map((space, i) => (
            <div className="py-3 px-6 hover:bg-gray-200 cursor-pointer" key={i}>
              <p>#{space}</p>
              <p className="font-light text-sm">4124 Docs in this Space</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
