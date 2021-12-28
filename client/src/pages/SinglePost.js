import '../index.css';
import Post from '../components/post';
import React, { useEffect } from 'react';
import { useAuth } from '../controller/Firebase';
import { NavTab, SpacesTab } from './Dashboard';
import { useLocation, useSearchParams } from 'react-router-dom';
import IconHeart from '../icons/heart';

export default function SinglePost() {
  const currentUser = useAuth();
  const [searchParams] = useSearchParams();
  const post_id_url = searchParams.get('id');
  console.log(post_id_url);
  const post = useLocation().state;

  useEffect(() => {
    // (async () => {
    //   const [data, responded] = await getPostById(id);
    //   console.log(data);
    //   console.log(responded);
    //   setPost(data);
    // })();
  }, []);

  return (
    <div className="flex min-h-screen justify-center divide-x">
      <NavTab currentUser={currentUser} active="dash" />
      <div className="flex flex-col items-center divide-y xl:w-1/2 flex-grow xl:flex-grow-0 bg-gray-50">
        <h1 className="font-bold text-gray-500 text-3xl text-left pt-5 w-full px-3">
          View
        </h1>
        <Post key={post.id} data={post} />
        <div className="p-3 w-full space-y-2">
          <CommmentCreator user={currentUser} />
          <Comment user={currentUser} />
          <Comment user={currentUser} />
        </div>
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

function CommmentCreator({ user }) {
  return (
    <div className="flex p-3 rounded-lg hover:bg-indigo-100 bg-indigo-200">
      <div className="w-16 h-16 mt-2 rounded-full shadow-lg flex-shrink-0">
        <img
          className="w-full h-full object-cover rounded-full shadow-lg"
          src={user?.photoURL}
          alt={user?.displayName}
        />
      </div>
      <div className="w-4/5 flex flex-col p-2 text-sm">
        <div className="font-semibold mb-1 text-indigo-400">me</div>
        <form className="w-full">
          <input
            className="appearance-none bg-transparent border-indigo-300 w-full mr-3 py-3 leading-tight focus:outline-none"
            type="text"
            placeholder="Speak you mind..."
            autoFocus={true}
          />
        </form>
      </div>
    </div>
  );
}

function Comment({ user }) {
  return (
    <div className="flex p-3 rounded-lg hover:bg-gray-200">
      <div className="w-16 h-16 mt-2 rounded-full shadow-lg flex-shrink-0">
        <img
          className="w-full h-full object-cover rounded-full block shadow-lg"
          src={user?.photoURL}
          alt={user?.displayName}
        />
      </div>
      <div className="w-auto flex flex-col p-2 text-sm">
        <div className="font-semibold mb-1">
          {user?.displayName + ' '}
          &#183; <div className="font-light inline">19 Day ago</div>
        </div>
        <div className="mb-2">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            id augue rutrum, ultrices tellus quis, consectetur risus. Cras vel
            molestie nunc, et maximus odio.
          </p>
        </div>
      </div>
      <div className="grow flex items-center">
        <button className="rounded-full hover:bg-gray-300 p-3">
          <IconHeart />
        </button>
      </div>
    </div>
  );
}
