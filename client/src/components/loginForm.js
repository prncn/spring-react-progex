import { Input } from '../pages/Home';
import { signin } from '../firebase';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await signin(emailRef.current.value, passwordRef.current.value);
      navigate('/dash');
    } catch {
      setError('Failed to log in');
      alert(error);
    }

    setLoading(false);
  }

  return (
    <form>
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
        <Link to="/">
          <button
            type="button"
            className="py-2 px-4 shadow-lg hover:shadow rounded-lg text-white font-semibold mt-5"
          >
            Sign up
          </button>
        </Link>
      </div>
    </form>
  );
}
