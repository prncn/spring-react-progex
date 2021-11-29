import '../index.css';
import LoginForm from '../components/loginForm';
import SignupForm from '../components/signupForm';

export function Input({ label, type, placeholder, ref }) {
  return (
    <>
      <label className="text-gray-100">{label}</label>
      <input
        className="w-full p-2 my-2 text-gray-500 font-semibold rounded-lg focus:outline-none bg-gray-100"
        type={type}
        autoComplete="off"
        placeholder={placeholder}
        ref={ref}
      ></input>
    </>
  );
}

export default function Home({ form }) {
  return (
    <div className="h-full flex justify-center items-center md:flex-row flex-col overflow-hidden bg-gray-100">
      <div className="h-full w-full fixed z-0">
        <div className="bg-gray-100 left-10 bottom-24 h-96 login-background__card"></div>
        <div className="bg-gray-100 left-5 bottom-24 h-96 login-background__card"></div>
        <div className="bg-green-200 left-0 bottom-0 h-80 login-background__card"></div>
        <div className="bg-gray-100 left-14 top-2/3 h-96 login-background__card"></div>
        <div className="bg-gray-100 left-20 top-2/3 h-96 login-background__card"></div>

        <div className="bg-green-200 inset-10 w-96 h-80 login-background__card"></div>
        <div className="bg-gray-100 inset-5 w-96 h-80 login-background__card"></div>
        <div className="bg-gray-100 left-0 top-0 w-96 h-80 login-background__card"></div>
      </div>

      <div className="font-bold text-3xl md:text-7xl md:w-96 text-center md:text-right drop-shadow-lg text-gray-700 md:visible invisible">
        <div className="text-6xl md:text-7xl text-gray-600 md:text-green-300 visible">
          Murdoc.
        </div>{' '}
        The worse way to share docs.
      </div>
      <div className="z-10 bg-gray-700 md:bg-indigo-300 m-2 p-4 sm:w-80 h-96 shadow-lg rounded-lg flex flex-col justify-center items-center hover:shadow transition duration-300 ease-in-out">
        <p className="font-semibold text-white text-3xl">Sign in</p>
        {form === 'login' ? <LoginForm /> : <SignupForm />}
      </div>
    </div>
  );
}
