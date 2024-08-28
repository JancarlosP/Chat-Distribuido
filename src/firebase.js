import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBzQcT3SErhPyc3t5SrCLKsg9hmdEAKlgk",

  authDomain: "chat-1b7be.firebaseapp.com",

  projectId: "chat-1b7be",

  storageBucket: "chat-1b7be.appspot.com",

  messagingSenderId: "1008910207083",

  appId: "1:1008910207083:web:302f4e26d0a8a868ea092e",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
