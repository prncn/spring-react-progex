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

import React, { useContext, useState, useEffect } from 'react';
import { auth, db } from '../controller/Firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(true);
  const [loading, setLoading] = useState();

  const images = [
    'https://i.imgur.com/NDFE7BQ.jpg',
    'https://i.imgur.com/Ks2oou4.jpg',
    'https://i.imgur.com/kLcZbQT.jpeg',
    'https://i.imgur.com/ncnHn9I.jpg',
    'https://pic.onlinewebfonts.com/svg/img_258083.png',
  ];

  const photoURL = images[Math.random() * images.length];

  async function signup(email, password, displayName) {
    return await createUserWithEmailAndPassword(auth, email, password).then(
      (res) => {
        updateProfile(res.user, {
          displayName,
          photoURL,
        });
        try {
          setDoc(doc(db, 'users', res.user.uid), {
            displayName,
            photoURL,
            email,
            likedPosts: [],
            savedPosts: [],
            followers: [],
            following: [],
            messages: [],
          });
        } catch (e) {
          console.error('Error adding document: ', e);
        }
      }
    );
  }

  function signin(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    signOut(auth);
  }

  function resetPassword() {
    sendPasswordResetEmail(auth);
  }

  function _updateEmail(email) {
    try {
      const promiseAuth = updateEmail(auth.currentUser, email);
      const promiseStore = updateDoc(doc(db, 'users', auth.currentUser.uid), {
        email,
      });
      return [promiseAuth, promiseStore];
    } catch (error) {
      console.log(error);
    }
  }

  function _updatePassword(email) {
    return updatePassword(auth.currentUser, email);
  }

  function _updateProfile(displayName, photoURL) {
    try {
      const promiseAuth = updateProfile(auth.currentUser, {
        displayName,
        photoURL,
      });
      const promiseStore = updateDoc(doc(db, 'users', auth.currentUser.uid), {
        displayName,
        photoURL,
      });
      return [promiseAuth, promiseStore];
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(loading);
    });

    return unsubscribe;
  }, [loading]);

  const value = {
    signin,
    signup,
    logout,
    resetPassword,
    _updateEmail,
    _updatePassword,
    _updateProfile,
    currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
