import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import api from '../controller/QueryService';
import Post from '../components/Post';
import { prominent } from 'color.js';
import { PDFviewer } from '../components/PDFviewer';
import { NavTab } from '../components/NavTab';
import { SpacesTab } from './Dashboard';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

export default function Profile() {
  const [postData, setData] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState({});
  const [activeTab, setActiveTab] = useState('Posts');

  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [profilePalette, setProfilePalette] = useState([]);
  const [followed, setFollowed] = useState(false);

  const params = useParams();
  useEffect(() => {
    (async () => {
      const [data, response] = await api.getUserById(params.userId);
      console.log(response);
      setUser(data);
      if (data.followers.includes(currentUser?.uid)) {
        setFollowed(true);
      }
    })();
  }, [params, currentUser]);

  useEffect(() => {
    (async () => {
      const [data, status] = await api.getPostsOfUser(user.id);
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
        let validLikedIds = [];
        for (const id of likedPostsIds) {
          const { data } = await api.getPostById(id);
          console.log(data);
          if (data.id !== '5') {
            likedPosts.push(data);
            validLikedIds.push(id);
          }
        }
        if (likedPostsIds.length !== validLikedIds.length) {
          console.log('FIRED');
          api.updateUser(user.id, { likedPosts: validLikedIds });
        }
        setData(likedPosts);
        break;

      case 'Saved':
        const savedPostsIds = user.savedPosts;
        let savedPosts = [];
        let validSavedIds = [];
        for (const id of savedPostsIds) {
          const { data } = await api.getPostById(id);
          savedPosts.push(data);
          if (data !== null || data !== undefined) {
            savedPosts.push(data);
            validSavedIds.push(id);
          }
        }
        if (savedPostsIds.length !== validSavedIds.length) {
          api.updateUser(user.id, { savedPosts: validSavedIds });
        }
        setData(savedPosts);
        break;

      default:
        setData(userPosts);
        break;
    }
  }

  async function toggleFollowed() {
    const [currentUserFull, response] = await api.getUserById(currentUser?.uid);
    console.log(response);
    const newFollowing = currentUserFull?.following;
    const newFollowers = user?.followers;

    if (!followed && !newFollowing.includes(user?.id)) {
      newFollowing.push(user?.id);
      newFollowers.push(currentUserFull?.id);
    } else {
      newFollowing.splice(newFollowing.indexOf(user?.id), 1);
      newFollowers.splice(newFollowers.indexOf(currentUserFull?.id), 1);
    }

    api.updateUser(currentUserFull?.id, {
      following: newFollowing,
    });
    api.updateUser(user?.id, {
      followers: newFollowers,
    });
    setFollowed(!followed);
  }

  return (
    <div className="flex min-h-screen justify-center divide-x">
      <NavTab currentUser={currentUser} active="profile" />
      <div className="flex flex-col items-center xl:w-1/2 flex-grow xl:flex-grow-0 bg-gray-50 relative">
        <div
          className={`w-full h-32 flex justify-end rounded-b-xl p-3 relative bg-cover bg-black animate-gradient-y `}
          style={{
            backgroundImage: `linear-gradient(to bottom left, black, ${profilePalette[0]})`,
          }}
        >
          <div className="w-32 h-32 rounded-full absolute -bottom-10 left-10 border-4 border-gray-50 bg-gray-50">
            <img
              className="w-full h-full object-cover rounded-full"
              src={user?.photoURL}
              alt="pfp_icon"
            />
          </div>
          <div className="flex flex-col p-4 h-full text-right">
            <div className="text-3xl text-white font-semibold">
              {user.displayName}
            </div>
            <div className=" text-white font-light">
              {user.likedPosts?.length} Docs Liked
            </div>
            <div className=" text-white font-light">
              {user.savedPosts?.length} Docs Saved
            </div>
          </div>
          <div className="h-full self-end">
            {user.id !== currentUser.uid ? (
              <div
                className={`py-2 px-6 ${
                  followed
                    ? 'bg-transparent text-white border border-white'
                    : 'bg-white text-black'
                } rounded-full font-semibold cursor-pointer hover:opacity-90 transition`}
                onClick={toggleFollowed}
              >
                <span className="opactiy-100">
                  {followed ? 'Following' : 'Follow'}
                </span>
              </div>
            ) : (
              <div className="py-2 px-6 border border-white rounded-full text-white font-semibold hover:shadow transition">
                <button onClick={() => setIsOpen(true)}>Edit Profile</button>
                <Modal open={isOpen} close={() => setIsOpen(false)} />
              </div>
            )}
          </div>
        </div>
        <div className="flex self-start mt-14 space-x-5 m-3">
          <button onClick={() => switchTab('Posts')}>
            <span
              className={
                `font-bold text-3xl text-left focus:outline-none ` +
                (activeTab === 'Posts'
                  ? 'text-gray-500'
                  : 'text-gray-300 hover:text-gray-400')
              }
            >
              Posts
            </span>
          </button>
          <button onClick={() => switchTab('Liked')}>
            <span
              className={
                `font-bold text-3xl text-left focus:outline-none ` +
                (activeTab === 'Liked'
                  ? 'text-gray-500'
                  : 'text-gray-300 hover:text-gray-400')
              }
            >
              Liked
            </span>
          </button>
          <button onClick={() => switchTab('Saved')}>
            <span
              className={
                `font-bold text-3xl text-left focus:outline-none ` +
                (activeTab === 'Saved'
                  ? 'text-gray-500'
                  : 'text-gray-300 hover:text-gray-400')
              }
            >
              Saved
            </span>
          </button>
        </div>
        {postData.map((post, i) => (
          <Post key={post.id} data={post} currentUser={currentUser}>
            <PDFviewer
              idn={i}
              file={post.url}
              title={post.title}
              embedMode="SIZED_CONTAINER"
            />
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
