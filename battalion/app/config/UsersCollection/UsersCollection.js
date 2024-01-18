import firestore from "@react-native-firebase/firestore";

// Function to add user data to Firestore
export const checkIfUserExistsByPhone = async (phoneNum) => {
  try {
    const users = await firestore()
      .collection("users")
      .where("phoneNumber", "==", phoneNum)
      .get();

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

export const createUser = async (userId, userData) => {
  try {
    await firestore().collection("users").doc(userId).set(userData);
    return true;
  } catch (err) {
    throw new Error(err);
  }
};
export const addUserToFirestore = async (userId, userData, merge = true) => {
  try {
    if (userData.email || userData.phoneNumber) {
      // No need to explicitly check for user existence, set method handles it
      await firestore()
        .collection("users")
        .doc(userId)
        .set(userData, { merge });
    } else {
      await firestore()
        .collection("users")
        .doc(userId)
        .set(userData, { merge });
    }

    return true;
  } catch (error) {
    console.error("Error adding user to Firestore:", error);
    throw error;
  }
};
