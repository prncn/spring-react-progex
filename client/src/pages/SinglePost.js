import '../index.css';
import Post from '../components/post';
import React, { createRef, useState } from 'react';
import { NavTab, SpacesTab } from './Dashboard';
import { useLocation, useSearchParams } from 'react-router-dom';
import IconHeart from '../icons/heart';
import { PDFviewer } from '../components/PDFviewer';
import { useAuth } from "../context/AuthContext";

export default function SinglePost() {
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const post_id_url = searchParams.get('id');
  console.log(post_id_url);
  const post = useLocation().state;
  const [paginator, setPaginator] = useState();
  
  return (
    <div className="flex min-h-screen justify-center divide-x">
      <NavTab currentUser={currentUser} active="dash" />
      <div className="flex flex-col items-center divide-y xl:w-1/2 flex-grow xl:flex-grow-0 bg-gray-50">
        <h1 className="font-bold text-gray-500 text-3xl text-left pt-5 w-full px-3">
          View
        </h1>
        <Post key={post.id} data={post} currentUser={currentUser}>
          <PDFviewer file={post.url} title={post.title} setPaginator={setPaginator} embedMode='SIZED_CONTAINER' />
        </Post>
        <div className="p-3 w-full space-y-2">
          <CommmentCreator user={currentUser} />
          <Comment user={currentUser} paginator={paginator} />
          <Comment user={currentUser} paginator={paginator} />
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

function Comment({ user, paginator }) {
  const contentRef = createRef();

  function paginate() {
    const content = contentRef.current?.innerText;
    const strip = content.replace(/[^0-9]/g, "");
    console.log(strip);

    return paginator.ready().then(() => {
      paginator.goToPage(Number(strip));
    });
  }
  
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
          <div ref={contentRef}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            id augue rutrum, <div  onClick={paginate} className='text-indigo-400 inline-block hover:underline cursor-pointer'>page 5</div> tellus quis, consectetur risus. Cras vel
            molestie nunc, et maximus odio.
          </div>
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
