import '../index.css';
import { Input } from '../pages/Home';
import { signin } from '../firebase';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginForm() {
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
          type="button"
          className="py-2 px-6 bg-green-200 hover:bg-green-300 rounded-lg text-gray-700 font-semibold mt-5"
        >
          Sign in
        </button>
        <Link to="/signup">
          <button
            type="button"
            className="p-3 text-gray-500 mx-1 shadow-lg hover:shadow rounded-lg font-semibold text-sm mt-5"
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
