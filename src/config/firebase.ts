// src/config/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCSBTfAxHRxef4CA7h3YKw2bXpykiiWPg0",
  authDomain: "bau-tesouros.firebaseapp.com",
  databaseURL: "https://bau-tesouros-default-rtdb.firebaseio.com",
  projectId: "bau-tesouros",
  storageBucket: "bau-tesouros.firebasestorage.app",
  messagingSenderId: "1090626229764",
  appId: "1:1090626229764:web:26ef342e3cbb97b370c751"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);  