import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC8-s7doqaDtmo9Vkb5xyxAfXSwIJpdRFk",
  authDomain: "facebook-8ee8a.firebaseapp.com",
  projectId: "facebook-8ee8a",
  storageBucket: "facebook-8ee8a.appspot.com",
  messagingSenderId: "559285896692",
  appId: "1:559285896692:web:d83831c287738e08b6a5a1"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export const storage = getStorage();
export const db = getFirestore(app)
