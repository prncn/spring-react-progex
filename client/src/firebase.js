// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth} from "firebase/auth"
import { createUserWithEmailAndPassword,signInWithEmailAndPassword,
        onAuthStateChanged, signOut, sendPasswordResetEmail,
        updatePassword,updateEmail} from "@firebase/auth";
import { useState,useEffect } from "react";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsrDw9IPriLCVnWEs8JccAF_vvT9c81qk",
  authDomain: "auth-development-b1a51.firebaseapp.com",
  projectId: "auth-development-b1a51",
  storageBucket: "auth-development-b1a51.appspot.com",
  messagingSenderId: "720198584640",
  appId: "1:720198584640:web:6e699d63d1da6ffa4dd2a5"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const auth = getAuth()

export function signup(email,password) {
    return createUserWithEmailAndPassword(auth,email,password)
}

export function signin(email,password) {
    return signInWithEmailAndPassword(auth,email,password)
}

export function logout() {
    signOut(auth)
}

export function resetPassword() {
    sendPasswordResetEmail(auth)
}

export function _updateEmail(email) {
   return updateEmail(auth.currentUser,email)
}

export function _updatePassword(email) {
    return updatePassword(auth.currentUser,email)
 }
 


// custom hook
export function useAuth() {
    const [currentUser,setCurrentUser] = useState();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth,user => {
          setCurrentUser(user)
        })
    
        return unsubscribe
      }, [])

      return currentUser

}
