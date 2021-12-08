// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from 'firebase/auth';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  updateEmail,
} from '@firebase/auth';
import { useState, useEffect } from 'react';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBGVejgoBEWRT5w4HIRMKOe5IoRpcndWHo',
  authDomain: 'prog-ex.firebaseapp.com',
  projectId: 'prog-ex',
  storageBucket: 'prog-ex.appspot.com',
  messagingSenderId: '435059451981',
  appId: '1:435059451981:web:231d082cb78c8648149404',
  measurementId: 'G-CRLNDZDZKZ',
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const auth = getAuth();

export function signup(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function signin(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  signOut(auth);
}

export function resetPassword() {
  sendPasswordResetEmail(auth);
}

export function _updateEmail(email) {
  return updateEmail(auth.currentUser, email);
}

export function _updatePassword(email) {
  return updatePassword(auth.currentUser, email);
}

// custom hook
export function useAuth() {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  return currentUser;
}
