import '../index.css';
import React, { useState, useRef } from 'react';
import { resetPassword } from '../firebase';
import { Link } from 'react-router-dom';
import { Input } from '../pages/Home';

export default function ResetPasswordForm() {
  const emailRef = useRef();
  const [loading, setLoading] = useState();
  const [setMessage] = useState(); // used to display messages to the user
  const [setError] = useState(); // used to display errors to the user

  async function handleresetPasword(e) {
    e.preventDefault();

    try {
      setMessage('');
      setError('');
      setLoading(true);
      if (emailRef.current.value) {
        await resetPassword(emailRef.current.value);
      }
      setMessage('Check your E-Mail inbox for further instructions');
    } catch {
      alert('Failed to send E-Mail to reset password');
      setError('Failed to send E-Mail to reset password,try again');
    }

    setLoading(false);
  }

  return (
    <form>
      <p className="home-form__heading">Reset</p>
      <Input className="w-full" ref={emailRef} type="email" placeholder="E-Mail" required />
      <div className="flex justify-between">
        <button
          disabled={loading}
          onClick={handleresetPasword}
          type="button"
          className="py-2 px-6 w-full bg-green-200 hover:bg-green-300 rounded-lg text-gray-700 font-semibold mt-5"
        >
          Reset Password
        </button>
      </div>
      <div className="mt-10 text-sm text-gray-300 hover:text-gray-500">
        <Link to="/login">Sign in</Link>
      </div>
    </form>
  );
}
