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

  function updateMessages(messages) {
    const ref = doc(db, 'users', auth.currentUser.uid);
    console.log('firing');
    console.log(messages);
    try {
      updateDoc(ref, {
        messages,
      });
    } catch (error) {
      console.log(error);
    }
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
    return updateEmail(auth.currentUser, email);
  }

  function _updatePassword(email) {
    return updatePassword(auth.currentUser, email);
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
    currentUser,
    updateMessages,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
