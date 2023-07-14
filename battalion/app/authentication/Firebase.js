import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
const auth = getAuth(app);

onAuthStateChanged(auth, async (user) => {
  if (user) {
    await AsyncStorage.setItem("user", JSON.stringify(user));
  } else {
    await AsyncStorage.removeItem("user");
  }
});

export { auth };
