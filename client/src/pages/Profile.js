import React, { useEffect, useRef, useState } from 'react';
import * as Vibrant from 'node-vibrant';
import { useAuth, _updateEmail, _updatePassword } from '../controller/Firebase';
import { useNavigate } from 'react-router';
import { NavTab, SpacesTab } from './Dashboard';
import { getPosts } from '../controller/QueryService';
import Post from '../components/post';

export default function Profile() {
  const [data, setData] = useState();

  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [loading, setLoading] = useState();
  const currentUser = useAuth();
  const navigate = useNavigate();
  console.log(loading);
  console.log(handleUpdate);

  const profileImage = currentUser?.photoURL;
  const [profilePalette, setProfilePalette] = useState('#0000');
  Vibrant.from('path/to/image').getPalette((err, palette) => {
    if (err) console.log(err);

    setProfilePalette(palette);
  });

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
        alert('Profile could not be updated , try again');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    (async () => {
      const { data, status } = await getPosts();
      console.log(status);
      setData(data);
    })();
  }, []);

  return (
    <div className="flex min-h-screen justify-center divide-x">
      <NavTab currentUser={currentUser} active="dash" />
      <div className="flex flex-col items-center divide-y xl:w-1/2 flex-grow xl:flex-grow-0 bg-gray-50">
        <h1 className="font-bold text-gray-500 text-3xl text-left pt-10 w-full px-3">
          Posts
        </h1>
        {data.map((post, i) => (
          <Post key={post.id} data={post} idn={i} />
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
