import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBqfq05LlqUxRx90YFszIb3OU2zpUCRpvc",
  authDomain: "portfolio-f7bc4.firebaseapp.com",
  projectId: "portfolio-f7bc4",
  storageBucket: "portfolio-f7bc4.firebasestorage.app",
  messagingSenderId: "502962793505",
  appId: "1:502962793505:web:30f0091be83e3cab968760",
  measurementId: "G-0YK64ESE5K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
