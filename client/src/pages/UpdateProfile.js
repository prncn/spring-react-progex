
import React,{useRef,useState} from 'react'
import { useAuth,_updateEmail,_updatePassword } from '../firebase';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';


export default function UpdateProfile() {

    const emailRef =useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const [loading,setLoading] = useState();
    const [error,setError] = useState();
    const currentUser = useAuth();
    const navigate = useNavigate();


    function handleUpdate(e) {
        e.preventDefault();


        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            setError('Passwords do not match')
            alert('Passwords do not match')
          }

          setError('')
          setLoading(true)
          const promises = [];

          if(emailRef.current.value !== currentUser.email) {
              promises.push(_updateEmail(currentUser.email))
          }

          if(passwordRef.current.value) {
              promises.push(_updatePassword(passwordRef.current.value))
          }

          Promise.all(promises).then(() =>  
          {
              navigate('/')
          }).catch(() => {
              setError('Profile could not be updated , try again')
              alert('Profile could not be updated , try again')
          }).finally(() => 
          {
              setLoading(false)
          })


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
        <p className="font-semibold text-white text-3xl">Update Profile</p>
        <form>
            <input ref={emailRef} type="email" placeholder="E-Mail" defaultValue={currentUser?.email} />
            <input ref={passwordRef} type="password" placeholder="Password"/>
            <input ref={passwordConfirmRef} type="password" placeholder="Confirm Password"/>
            
          <div className="flex justify-between">
            <button disabled={loading} onClick={handleUpdate}
              type="button"
              className="py-2 px-6 bg-green-200 hover:bg-green-300 rounded-lg text-gray-700 font-semibold mt-5"
            >
              Update
            </button>
            <button
              type="button"
              className="py-2 px-4 shadow-lg hover:shadow rounded-lg text-white font-semibold mt-5"
            >
             <Link to="/dash"> Cancel </Link>
            </button>
          </div>
        </form>
      </div>
    </div>
    )
}

