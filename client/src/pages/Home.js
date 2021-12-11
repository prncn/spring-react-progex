import '../index.css';
import { LoginForm, SignupForm, ResetPasswordForm } from '../components/homeForms';
import { forwardRef } from 'react';
import { useAuth } from '../context/AuthContext';

export const Input = forwardRef((props, ref) => {
  return (
    <>
      <label className="text-gray-700 text-sm">{props.label}</label>
      <input
        {...props}
        className="w-full p-3 my-2 text-gray-500 text-sm rounded focus:outline-none border bg-gray-200"
        autoComplete="off"
        ref={ref}
      ></input>
    </>
  );
});

export default function Home({ form }) {
  return (
    <div className="h-full flex justify-center items-center md:flex-row flex-col overflow-hidden bg-gray-100">
      <div className="h-full w-full fixed z-0">
        <div className="bg-gray-100 left-10 bottom-24 h-96 login-background__card"></div>
        <div className="bg-gray-100 left-5 bottom-24 h-96 login-background__card"></div>
        <div className="bg-green-200 left-0 bottom-0 h-80 login-background__card"></div>
        <div className="bg-gray-100 left-14 top-2/3 h-96 login-background__card"></div>
        <div className="bg-gray-100 left-20 top-2/3 h-96 login-background__card"></div>
        <div></div>

        <div className="bg-green-200 inset-10 w-96 h-80 login-background__card"></div>
        <div className="bg-gray-100 inset-5 w-96 h-80 login-background__card"></div>
        <div className="bg-gray-100 left-0 top-0 w-96 h-80 login-background__card"></div>
      </div>

      <div className="font-bold text-3xl md:text-7xl md:w-96 text-center md:text-right drop-shadow-lg text-gray-700 md:visible invisible">
        <div className="text-6xl md:text-7xl text-gray-600 md:text-green-300 visible">
          Murdoc.
        </div>{' '}
        The weird way to share docs.
      </div>
      <div className="z-10 bg-gray-700 md:bg-gray-100 m-2 p-5 sm:w-80 h-96 shadow-xl rounded-lg flex flex-col justify-center items-center hover:shadow transition duration-300 ease-in-out">
        {form === 'login' && <LoginForm /> }
        {form === 'signup' && <SignupForm /> }
        {form === 'reset' && <ResetPasswordForm /> }
      </div>
      <div className="invisible lg:visible h-full w-1/3 fixed top-0 right-0 bg-hero-pattern"></div>
    </div>
  );
}
