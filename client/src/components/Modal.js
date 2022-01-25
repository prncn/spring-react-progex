import React from 'react';
import { Input } from '../pages/Home';
import { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { IconClose } from '../icons/PostIcons';

const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#FFF',
  zIndex: 1000,
  width: '40em',
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
  const { currentUser, _updateEmail, _updatePassword, _updateProfile } =
    useAuth();
  const emailRef = useRef();
  const usernameRef = useRef();
  const photoRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [loading, setLoading] = useState();
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL);

  function handleUpdate(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);
    const promises = [];

    if (emailRef.current.value !== currentUser.email) {
      const promiseUpdateEmail = _updateEmail(currentUser.email);
      promises.push([...promiseUpdateEmail]);
    }

    if (passwordRef.current.value) {
      promises.push(_updatePassword(passwordRef.current.value));
    }

    if (usernameRef.current.value || photoRef.current.value) {
      const newDisplayName =
        usernameRef.current.value || currentUser.displayName;
      const newPhotoURL = photoRef.current.value || currentUser.photoURL;
      const promiseUpdateProfile = _updateProfile(newDisplayName, newPhotoURL);
      promises.push([...promiseUpdateProfile]);
    }

    Promise.all(promises)
      .then(() => {
        close();
      })
      .catch((err) => {
        console.log(err);
        alert('Profile could not be updated, try again');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handlePhotoChange(event) {
    event.preventDefault();
    if (!/^ *$/.test(event.target.value)) {
      setPhotoURL(event.target.value);
    } else {
      setPhotoURL(currentUser?.photoURL);
    }
  }

  if (!open) return null;

  return (
    <>
      <div style={OVERLAY_STYLES} onClick={close} />
      <div style={MODAL_STYLES} className="rounded-xl p-5 relative">
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
        <div className="flex">
          <div className="w-32 h-32 rounded-full border-4 border-gray-50 bg-gray-50 cursor-pointer relative flex-none">
            <img
              className="w-full h-full object-cover rounded-full"
              src={photoURL}
              alt="pfp_icon"
            />
            <div className="bg-black absolute top-0 left-0 opacity-0 h-full w-full hover:opacity-30 transition rounded-full flex-none" />
          </div>
          <div className="flex flex-col justify-end w-full ml-5">
            <Input
              ref={photoRef}
              label="Profile Icon"
              type="text"
              placeholder={currentUser.photoURL}
              onChange={handlePhotoChange}
            />
          </div>
        </div>
        <form>
          <div className="flex space-x-1">
            <div className="w-1/2">
              <Input
                ref={usernameRef}
                label="Username"
                type="username"
                placeholder={currentUser.displayName}
              />
            </div>
            <div className="w-1/2">
              <Input
                ref={emailRef}
                label="Email"
                type="email"
                placeholder={currentUser.displayName}
              />
            </div>
          </div>
          <div className="flex space-x-1">
            <div className="w-1/2">
              <Input
                ref={passwordRef}
                label="Password"
                type="password"
                placeholder="Password"
              />
            </div>
            <div className="w-1/2">
              <Input
                ref={passwordConfirmRef}
                label="Confirm Password"
                type="password"
                placeholder="Confirm Password"
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
