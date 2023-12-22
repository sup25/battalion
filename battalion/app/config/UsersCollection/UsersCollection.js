import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../Firebase/Firebase";

// Function to add user data to Firestore
export const checkIfUserExistsByPhone = async (phoneNum) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("phoneNumber", "==", phoneNum));
    const querySnapshot = await getDocs(q);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data());
    });

    if (users.length > 0) {
      throw new Error("Number in use. Please choose another number.");
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error adding user to Firestore:", error);
    throw error; // Return false if there's an error
  }
};
export const addUserToFirestore = async (userId, userData) => {
  console.log("userData", userData);
  try {
    const usersRef = collection(db, "users");
    let q = null;
    if (userData.email) {
      q = query(usersRef, where("email", "==", userData.email));
    }
    if (userData.phoneNumber) {
      q = query(usersRef, where("phoneNumber", "==", userData.phoneNumber));
    }
    if (q) {
      const querySnapshot = await getDocs(q);
      console.log("querySnapshot", querySnapshot);
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });

      if (users.length > 0) {
        if (userData.email) {
          console.log(users);
          throw new Error("User already exists. Please sign in.");
        }
        if (userData.phoneNumber) {
          throw new Error("Number in use. Please choose another number.");
        }
      }
    }
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, userData, { merge: true });
    return true; // Return true if the operation is successful
  } catch (error) {
    console.error("Error adding user to Firestore:", error);
    throw error; // Return false if there's an error
  }
};
