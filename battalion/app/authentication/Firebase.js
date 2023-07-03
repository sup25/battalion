// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJaNtdcqwWyq4_5875iGBMUppHWv4DWqk",
  authDomain: "battalion-f2010.firebaseapp.com",
  projectId: "battalion-f2010",
  storageBucket: "battalion-f2010.appspot.com",
  messagingSenderId: "719863504767",
  appId: "1:719863504767:web:66739e14abf6910134444a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { app, auth };
