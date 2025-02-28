import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAwDvvCQJc4ULzUOu8WFeqynD9SHB1JBbo",
  projectId: "gameathon-2025",
  storageBucket: "gameathon-2025.firebasestorage.app",
  messagingSenderId: "519076043044",
  appId: "1:519076043044:android:a0070d503703f4087dbbb1",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
