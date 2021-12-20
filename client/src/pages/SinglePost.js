import '../index.css';
import Post from '../components/post';
import React, { setState, useEffect } from 'react';
import { useAuth } from '../controller/Firebase';
import { NavTab, SpacesTab } from './Dashboard';
import { useLocation } from 'react-router-dom';

const placeholderPost = {
  id: '7',
  user: {
    id: '3',
    displayName: 'Aysha',
    photoURL: 'https://i.imgur.com/ncnHn9I.jpg',
  },
  title: 'Big Short Guide',
  description: 'Read this, it is important',
  date: {
    seconds: 1638807536,
    nanos: 782000000,
  },
  url: 'https://www.sprengel-museum.de/images/PDF/BIG-short-guide-en.pdf',
};

export default function SinglePost() {
  const currentUser = useAuth();
  const post = useLocation();

  console.log(post);

  return (
    <div className="flex min-h-screen justify-center divide-x">
      <NavTab currentUser={currentUser} active="dash" />
      <div className="flex flex-col items-center divide-y xl:w-1/2 flex-grow xl:flex-grow-0 bg-gray-50">
        <h1 className="font-bold text-gray-500 text-3xl text-left pt-10 w-full px-3">
          View
        </h1>
        <Post key={post.id} data={post} />
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
