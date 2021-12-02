import React, { useRef, useState } from 'react';
import { useAuth, _updateEmail, _updatePassword } from '../firebase';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { Input } from '../pages/Home';

export default function UpdateProfileForm() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [loading, setLoading] = useState();
  const currentUser = useAuth();
  const navigate = useNavigate();

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
    <form>
      <p className="font-semibold text-gray-400 text-3xl">Update Profile</p>
      <Input
        ref={emailRef}
        type="email"
        placeholder="E-Mail"
        defaultValue={currentUser?.email}
      />
      <Input ref={passwordRef} type="password" placeholder="Password" />
      <Input
        ref={passwordConfirmRef}
        type="password"
        placeholder="Confirm Password"
      />

      <div className="flex justify-between">
        <button
          disabled={loading}
          onClick={handleUpdate}
          type="button"
          className="py-2 px-6 bg-green-200 hover:bg-green-300 rounded-lg text-gray-700 font-semibold mt-5"
        >
          Update
        </button>
        <button
          type="button"
          className="home__right-btn"
        >
          <Link to="/dash"> Cancel </Link>
        </button>
      </div>
    </form>
  );
}
