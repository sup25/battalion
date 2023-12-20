import { doc, setDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

// Function to add user data to Firestore
export const addUserToFirestore = async (userId, userData) => {
  try {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, userData, { merge: true });
    return true; // Return true if the operation is successful
  } catch (error) {
    console.error("Error adding user to Firestore:", error);
    return false; // Return false if there's an error
  }
};
