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
import { collection, addDoc } from 'firebase/firestore';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(true);
  const [loading, setLoading] = useState();

  function signup(email, password, displayName) {
    return createUserWithEmailAndPassword(auth, email, password).then((res) => {
      updateProfile(res.user, {
        displayName,
        photoURL: 'https://pic.onlinewebfonts.com/svg/img_258083.png',
      });
      try {
        const docRef = addDoc(collection(db, 'users', res.user.id), {}).then(
          () => {
            console.log('Document written with ID: ', docRef.id);
          }
        );
      } catch (e) {
        console.error('Error adding document: ', e);
      }
    });
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
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
