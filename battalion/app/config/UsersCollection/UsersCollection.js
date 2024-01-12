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
export const addUserToFirestore = async (userId, userData) => {
  console.log("userData", userData);
  try {
    if (userData.email || userData.phoneNumber) {
      const users = await firestore()
        .collection("users")
        .where(
          userData.email
            ? ("email", "==", userData.email)
            : userData.phoneNumber
            ? ("phoneNumber", "==", phoneNum)
            : ""
        )
        .get();

      if (users.length > 0) {
        if (userData.email) {
          console.log(users);
          throw new Error("User already exists. Please sign in.");
        }
        if (userData.phoneNumber) {
          throw new Error("Number in use. Please choose another number.");
        }
      } else {
        await firestore().collection("users").doc(userId).set(userData);
      }
    } else {
      await firestore().collection("users").doc(userId).set(userData);
    }

    return true; // Return true if the operation is successful
  } catch (error) {
    console.error("Error adding user to Firestore:", error);
    throw error; // Return false if there's an error
  }
};
