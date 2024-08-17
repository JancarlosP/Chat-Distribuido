import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD5ORy-NIB4gmBd9dZAjSCetvn6biXEsco",
  authDomain: "chat-2dd6e.firebaseapp.com",
  projectId: "chat-2dd6e",
  storageBucket: "chat-2dd6e.appspot.com",
  messagingSenderId: "523781082897",
  appId: "1:523781082897:web:1b856e91809ccfb74806b0",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
