import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyBWYu0W_yfd_667TU2JqyspUTW78Os5ujY",
  authDomain: "tearsfoundation-df360.firebaseapp.com",
  projectId: "tearsfoundation-df360",
  storageBucket: "tearsfoundation-df360.firebasestorage.app",
  messagingSenderId: "549496823935",
  appId: "1:549496823935:web:83ba2a469f0e6b482d9f4a",
  measurementId: "G-9EQ0CVSHLB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  console.log('Firebase persistence error: ', err);
});

// Set auth persistence
setPersistence(auth, browserLocalPersistence);

export default app;