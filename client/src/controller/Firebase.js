import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { collection, addDoc } from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  updateEmail,
  updateProfile,
} from '@firebase/auth';
import { useState, useEffect } from 'react';

const firebaseConfig = {
  apiKey: 'AIzaSyBGVejgoBEWRT5w4HIRMKOe5IoRpcndWHo',
  authDomain: 'prog-ex.firebaseapp.com',
  projectId: 'prog-ex',
  storageBucket: 'prog-ex.appspot.com',
  messagingSenderId: '435059451981',
  appId: '1:435059451981:web:231d082cb78c8648149404',
  measurementId: 'G-CRLNDZDZKZ',
};

initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();

export function signup(email, password, displayName) {
  return createUserWithEmailAndPassword(auth, email, password).then((res) => {
    updateProfile(res.user, {
      displayName,
      photoURL: 'https://pic.onlinewebfonts.com/svg/img_258083.png',
    });
    try {
      const docRef = addDoc(collection(db, "users", res.user.id), {
      }).then(() => {
        console.log("Document written with ID: ", docRef.id);
      })
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  });
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