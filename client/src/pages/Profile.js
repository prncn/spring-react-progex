import React, { useEffect, useRef, useState } from 'react';
import { useAuth, _updateEmail, _updatePassword } from '../controller/Firebase';
import { useNavigate, useParams } from 'react-router';
import { NavTab, SpacesTab } from './Dashboard';
import {
  getPostById,
  getPostByUser as getPostsOfUser,
  getUserById,
} from '../controller/QueryService';
import Post from '../components/post';
import { prominent } from 'color.js';
import { PDFviewer } from '../components/PDFviewer';

export default function Profile() {
  const [data, setData] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState({});
  const [activeTab, setActiveTab] = useState('Posts');

  const currentUser = useAuth();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [loading, setLoading] = useState();
  const navigate = useNavigate();
  const [profilePalette, setProfilePalette] = useState([]);
  console.log(loading);

  const params = useParams();
  useEffect(() => {
    (async () => {
      const [data, response] = await getUserById(params.userId);
      console.log(response);
      setUser(data);
    })();
  }, [params]);

  function handleUpdate(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      alert('Passwords do not match');
    }

    setLoading(true);
    const promises = [];

    if (emailRef.current.value !== currentUser.email) {
      promises.push(_updateEmail(currentUser.email));
    }

    if (passwordRef.current.value) {
      promises.push(_updatePassword(passwordRef.current.value));
    }

    Promise.all(promises)
      .then(() => {
        navigate('/');
      })
      .catch(() => {
        alert('Profile could not be updated, try again');
      })
      .finally(() => {
        setLoading(false);
      });
  }
  console.log(handleUpdate);

  useEffect(() => {
    (async () => {
      const [data, status] = await getPostsOfUser(user.id);
      console.log(status);
      setUserPosts(data);
      setData(data);

      if (user?.photoURL !== undefined) {
        const color = await prominent(user.photoURL, {
          amount: 3,
          format: 'hex',
          sample: 30,
          group: 30,
        });
        setProfilePalette(color);
      }
    })();
  }, [user]);

  async function switchTab(currentTab) {
    setActiveTab(currentTab);

    switch (currentTab) {
      case 'Posts':
        setData(userPosts);
        break;

      case 'Liked':
        const likedPostsIds = user.likedPosts;
        let likedPosts = [];
        for (const id of likedPostsIds) {
          const { data } = await getPostById(id);
          likedPosts.push(data);
        }
        setData(likedPosts);
        break;
      
      case 'Saved':
        const savedPostsIds = user.savedPosts;
        let savedPosts = [];
        for (const id of savedPostsIds) {
          const { data } = await getPostById(id);
          savedPosts.push(data);
        }
        setData(savedPosts);
        break;

      default:
        setData(userPosts);
        break;
    }
  }

  return (
    <div className="flex min-h-screen justify-center divide-x">
      <NavTab currentUser={currentUser} active="profile" />
      <div className="flex flex-col items-center xl:w-1/2 flex-grow xl:flex-grow-0 bg-gray-50">
        <div className='w-full h-4' style={{backgroundColor: profilePalette[2]}}></div>
        <div
          className={`w-full h-40 flex rounded-b-xl p-3`}
          style={{
            backgroundImage: `linear-gradient(to bottom right, ${profilePalette[2]}, ${profilePalette[0]})`,
          }}
        >
          <div className="w-32 h-32 rounded-full">
            <img
              className="w-full h-full object-cover rounded-full"
              src={user?.photoURL}
              alt="pfp_icon"
            />
          </div>
          <div className="flex flex-col p-4 h-full">
            <div className="text-3xl text-white font-semibold mb-auto">
              {user.displayName}
            </div>
            <div className=" text-white font-light">
              <strong className="font-semibold">799</strong> Followers
            </div>
            <div className=" text-white font-light">239 Following</div>
          </div>
        </div>
        <div className="flex self-start mt-5 space-x-5 m-3">
          <button onClick={() => switchTab('Posts')}>
            <span
              className={
                `font-bold text-3xl text-left ` +
                (activeTab === 'Posts' ? 'text-gray-500' : 'text-gray-300')
              }
            >
              Posts
            </span>
          </button>
          <button onClick={() => switchTab('Liked')}>
            <span
              className={
                `font-bold text-3xl text-left ` +
                (activeTab === 'Liked' ? 'text-gray-500' : 'text-gray-300')
              }
            >
              Liked
            </span>
          </button>
          <button onClick={() => switchTab('Saved')}>
            <span
              className={
                `font-bold text-3xl text-left ` +
                (activeTab === 'Saved' ? 'text-gray-500' : 'text-gray-300')
              }
            >
              Saved
            </span>
          </button>
        </div>
        {data.map((post, i) => (
          <Post key={post.id} data={post} currentUser={currentUser}>
            <PDFviewer idn={i} file={post.url} title={post.title} embedMode='SIZED_CONTAINER'/>
          </Post>
        ))}
      </div>
      <SpacesTab
        spaces={[
          'distributedsystems',
          'illustrations',
          'streetwear',
          'fitness',
        ]}
      />
    </div>
  );
}
