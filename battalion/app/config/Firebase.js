import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOB7BcSJL0z46RG_8VET7R3axYekDBY2M",
  authDomain: "fir-auth-3f578.firebaseapp.com",
  databaseURL: "https://fir-auth-3f578-default-rtdb.firebaseio.com",
  projectId: "fir-auth-3f578",
  storageBucket: "fir-auth-3f578.appspot.com",
  messagingSenderId: "255101624190",
  appId: "1:255101624190:web:32883f32d3db47fa3d1d2f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const db = getFirestore(app);

export { app, auth, db };
