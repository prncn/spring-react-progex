import { Input } from '../pages/Home';
import { signup } from '../firebase';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function SignupForm() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [loading, setLoading] = useState();
  const [setError] = useState();

  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      setError('Passwords do not match');
      alert('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      navigate('/dash');
    } catch {
      alert('Error');
    }
    setLoading(false);
  }
  return (
    <form>
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
          className="py-2 px-6 bg-green-200 hover:bg-green-300 rounded-lg text-gray-700 font-semibold mt-5"
        >
          Sign up
        </button>
        <Link to="/login">
          <button
            type="button"
            className="py-2 px-4 shadow-lg hover:shadow rounded-lg text-white font-semibold mt-5"
          >
            Sign in
          </button>
        </Link>
      </div>
    </form>
  );
}
