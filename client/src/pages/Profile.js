import React, { useRef, useState } from 'react';
import { useAuth, _updateEmail, _updatePassword } from '../controller/Firebase';
import { useNavigate } from 'react-router';
import { NavTab } from './Dashboard';

export default function Profile() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [loading, setLoading] = useState();
  const currentUser = useAuth();
  const navigate = useNavigate();
  console.log(loading);
  console.log(handleUpdate);

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

  return (
    <div className="flex min-h-screen">
      <NavTab />
    </div>
  );
}
