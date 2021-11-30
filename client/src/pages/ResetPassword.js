import React,{useState,useRef} from 'react'
import { useNavigate } from 'react-router';
import { resetPassword } from '../firebase';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {


    const emailRef = useRef();
    const [loading,setLoading] = useState();
    const [message,setMessage] = useState(); // used to display messages to the user
    const [error,setError] = useState(); // used to display errors to the user


    async function handleresetPasword(e) {

        e.preventDefault();

        try {
            setMessage('')
            setError('')
            setLoading(true)
            if(emailRef.current.value) {
              await resetPassword(emailRef.current.value)
            }
            setMessage('Check your E-Mail inbox for further instructions')

        }catch {
            alert('Failed to send E-Mail to reset password')
            setError('Failed to send E-Mail to reset password,try again')
        }

        setLoading(false)

    }



    return (

        <div className="h-full flex justify-center items-center md:flex-row flex-col overflow-hidden bg-gray-100">
        <div className="h-full w-full fixed z-0">
          <div className='bg-gray-100 left-10 bottom-24 w-80 h-96 login-background__card'></div>
          <div className='bg-gray-100 left-5 bottom-24 w-80 h-96 login-background__card'></div>
          <div className='bg-green-200 left-0 bottom-0 w-80 h-80 login-background__card'></div>
          <div className='bg-gray-100 left-14 top-2/3 w-80 h-96 login-background__card'></div>
          <div className='bg-gray-100 left-20 top-2/3 w-80 h-96 login-background__card'></div>
    
          <div className='bg-green-200 inset-10 w-96 h-80 login-background__card'></div>
          <div className='bg-gray-100 inset-5 w-96 h-80 login-background__card'></div>
          <div className='bg-gray-100 left-0 top-0 w-96 h-80 login-background__card'></div>
        </div>
    
          <div className="font-bold text-3xl md:text-7xl md:w-96 text-center md:text-right drop-shadow-lg text-gray-700 md:visible invisible">
            <div className="text-6xl md:text-7xl text-gray-600 md:text-green-300 visible">Murdoc.</div> The
            worse way to share docs.
          </div>
          <div className="z-10 bg-gray-700 md:bg-indigo-300 m-2 p-4 sm:w-80 h-96 shadow-lg rounded-lg flex flex-col justify-center items-center hover:shadow transition duration-300 ease-in-out">
            <p className="font-semibold text-white text-3xl">Reset Password</p>
            <form>
                <input ref={emailRef} type="email" placeholder="E-Mail" required/>
              <div className="flex justify-between">
                <button disabled={loading} onClick={handleresetPasword}
                  type="button"
                  className="py-2 px-6 bg-green-200 hover:bg-green-300 rounded-lg text-gray-700 font-semibold mt-5"
                >
                  Reset Password
                </button>
              </div>
              <div>
              <Link to="/login">Sign in</Link>
              </div>
            </form>
          </div>
        </div>
      );
}
