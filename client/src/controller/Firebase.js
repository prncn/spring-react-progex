import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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


