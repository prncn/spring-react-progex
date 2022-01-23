import React from 'react';
import { Input } from '../pages/Home';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconClose } from '../icons/PostIcons';

const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#FFF',
  zIndex: 1000,
};

const OVERLAY_STYLES = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, .5)',
  zIndex: 1000,
};

export default function Modal({ open, close }) {
  const { currentUser, _updateEmail, _updatePassword } = useAuth();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [loading, setLoading] = useState();
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
        navigate('/profile');
      })
      .catch(() => {
        alert('Profile could not be updated, try again');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  if (!open) return null;

  return (
    <>
      <div style={OVERLAY_STYLES} onClick={close} />
      <div style={MODAL_STYLES} className="rounded-xl p-5 relative w-1/3">
        <div className="flex items-center justify-center space-x-2 absolute top-2 right-2">
          <button
            disabled={loading}
            onClick={handleUpdate}
            type="button"
            className="py-2 px-6 bg-black hover:opacity-100 opacity-60 rounded-full text-white font-semibold"
          >
            save
          </button>
          <button
            onClick={close}
            type="button"
            className="hover:bg-gray-100 rounded-full text-black transition p-3"
          >
            <IconClose />
          </button>
        </div>
        <div className="w-32 h-32 rounded-full border-4 border-gray-50 bg-gray-50 cursor-pointer relative">
          <img
            className="w-full h-full object-cover rounded-full"
            src={currentUser?.photoURL}
            alt="pfp_icon"
          />
          <div className="bg-black absolute top-0 left-0 opacity-0 h-full w-full hover:opacity-30 transition rounded-full" />
        </div>
        <form>
          {/* <p className="home-form__heading">Edit Profile</p> */}
          <Input
            ref={emailRef}
            label="Email"
            type="email"
            placeholder={currentUser.email}
          />
          <Input
            ref={passwordRef}
            label="Password"
            type="password"
            placeholder="Password"
          />
          <Input
            ref={passwordConfirmRef}
            label="Confirm Password"
            type="password"
            placeholder="Confirm Password"
          />
        </form>
      </div>
    </>
  );
}
