import React from 'react'
import ReactDom from 'react-dom'
import { Input } from '../pages/Home';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import { signin, signup, resetPassword } from '../controller/Firebase';
import { useAuth } from '../context/AuthContext';

const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#FFF',
  padding: '50px',
  zIndex: 1000
}

const OVERLAY_STYLES = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, .7)',
  zIndex: 1000
}


export default function Modal({ open,  onClose }) {

  const {currentUser, _updateEmail, _updatePassword} = useAuth();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [loading, setLoading] = useState();
  const navigate = useNavigate();

  function handleUpdate(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      alert("Passwords do not match");
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
        navigate("/");
      })
      .catch(() => {
        alert("Profile could not be updated, try again");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  if(!open) return null

  return /* RactDom.createPortal*/ (
    <>
      <div style={OVERLAY_STYLES} />
      <div style={MODAL_STYLES}>
      <form className='py-2'>
      <p className="home-form__heading">Sign up</p>
      <Input ref={emailRef} type="email" placeholder={currentUser.email} />
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
          className="py-2 px-6 bg-indigo-100 hover:bg-indigo-200 rounded-lg text-indigo-400 font-semibold mt-5"
        >
          Update
        </button>
        <button onClick={onClose} type="button" className="p-3 text-gray-500 mx-1 border border-black hover:bg-gray-200 rounded-lg font-semibold text-sm mt-5">
            Close
          </button>
      </div>
    </form>
      </div>
    </> //,
   // document.getElementById('portal')
  )
}