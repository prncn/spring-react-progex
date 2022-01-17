import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBGVejgoBEWRT5w4HIRMKOe5IoRpcndWHo",
  authDomain: "prog-ex.firebaseapp.com",
  projectId: "prog-ex",
  storageBucket: "prog-ex.appspot.com",
  messagingSenderId: "435059451981",
  appId: "1:435059451981:web:231d082cb78c8648149404",
  measurementId: "G-CRLNDZDZKZ",
};


initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
const storage = getStorage();

export async function uploadFile(file) {
  const storageRef = ref(storage, file.path);
  const snapshot = await uploadBytes(storageRef, file);
  console.log(`Uploaded file ${snapshot.metadata.bucket} to cloud.`);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
}

export async function deleteFile(url) {
  const storageRef = ref(storage, url);
  deleteObject(storageRef)
    .then(() => console.log(`Deleted file ${url}`))
    .catch((error) => console.error(error));
}


