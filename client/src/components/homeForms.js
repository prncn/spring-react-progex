import '../index.css';
import { Input } from '../pages/Home';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signin, signup, resetPassword } from '../controller/Firebase';

/**
 * Form component to handle login by user
 * @returns React component
 */
export function LoginForm() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [loading, setLoading] = useState();
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      setLoading(true);
      await signin(emailRef.current.value, passwordRef.current.value);
      navigate('/dash');
    } catch (error) {
      alert(error);
    }

    setLoading(false);
  }

  return (
    <form>
      <p className="home-form__heading">
        Sign in
      </p>
      <Input ref={emailRef} type="email" placeholder="E-Mail" />
      <Input ref={passwordRef} type="password" placeholder="Password" />
      <div className="flex justify-between">
        <button
          disabled={loading}
          onClick={handleLogin}
          type="submit"
          className="py-2 px-6 bg-indigo-100 hover:bg-indigo-200 rounded-lg text-indigo-400 font-semibold mt-5"
        >
          Sign in
        </button>
        <Link to="/signup">
          <button
            type="button"
            className="p-3 text-gray-500 mx-1 border border-black hover:bg-gray-200 rounded-lg font-semibold text-sm mt-5"
          >
            Create an Account
          </button>
        </Link>
      </div>
      <div className="mt-10">
        <Link className="text-sm text-gray-300 hover:text-gray-500" to="/forgot-password">Forgot Password?</Link>
      </div>
    </form>
  );
}

/**
 * Component to reset password 
 * @returns React component
 */
export function ResetPasswordForm() {
  const emailRef = useRef();
  const [loading, setLoading] = useState();
  const [setMessage] = useState(); // used to display messages to the user

  async function handleresetPasword(e) {
    e.preventDefault();

    try {
      setMessage('');
      setLoading(true);
      if (emailRef.current.value) {
        await resetPassword(emailRef.current.value);
      }
      setMessage('Check your E-Mail inbox for further instructions');
    } catch {
      alert('Failed to send E-Mail to reset password');
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

/**
 * Component for signing up user
 * @returns React component
 */
export function SignupForm() {
  const displayNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [loading, setLoading] = useState();

  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      alert('Passwords do not match');
    }

    try {
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value, displayNameRef.current.value);
      navigate('/dash');
    } catch (error) {
      alert(error);
    }
    setLoading(false);
  }
  return (
    <form>
      <p className="home-form__heading">
        Sign up
      </p>

      <Input ref={displayNameRef} type="text" placeholder="Display Name" />
      <Input ref={emailRef} type="email" placeholder="E-Mail" />
      <Input ref={passwordRef} type="password" placeholder="Password" />
      <Input
        ref={passwordConfirmRef}
        type="password"
        placeholder="Confirm Password"
      />

      <div className="flex justify-between">
        <button
          disabled={loading}
          onClick={handleSignup}
          type="button"
          className="py-2 px-6 bg-green-200 hover:bg-green-300 rounded-lg text-gray-800 font-semibold mt-5"
        >
          Sign up
        </button>
        <Link to="/login">
          <button
            type="button"
            className="home-form__right-btn"
          >
            Got an account
          </button>
        </Link>
      </div>
    </form>
  );
}
