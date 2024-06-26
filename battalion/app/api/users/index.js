import firestore from "@react-native-firebase/firestore";

export const addUserToDevice = async (deviceId, userId, macId) => {
  try {
    const devicesRef = firestore().collection("devices");
    const deviceRef = devicesRef.doc(deviceId);
    const deviceDoc = await deviceRef.get();
    if (!deviceDoc.exists) {
      throw new Error("Device not found");
    }
    const usersRef = firestore().collection("users");
    const userRef = usersRef.doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      throw new Error("User not found");
    }
    const isUserExistInUsersArr = deviceDoc
      .data()
      .users.find((user) => user.id === userId);
    const updatedUsersIds = [...deviceDoc.data().usersIds, userId];
    if (!isUserExistInUsersArr) {
      await deviceRef.update({
        usersIds: updatedUsersIds,
        users: firestore.FieldValue.arrayUnion({
          id: userId,
          ...userDoc.data(),
          approved: false,
          requestDate: new Date().getUTCDate(),
          requestUpdateDate: new Date().getUTCDate(),
          status: "pending",
        }),
      });
    } else {
      throw new Error("User already exists in the device.");
    }
  } catch (error) {
    console.error("Error adding user to device:", error);
    throw error;
  }
};

export const AddUserData = async (data) => {
  const { fourDigitCode, combinedSerialNum } = data;
  try {
    if (!data.owner) {
      throw new Error("Owner field is required.");
    }
    const devicesRef = firestore().collection("devices");
    const devicesSnapshot = await devicesRef
      .where("fourDigitCode", "==", fourDigitCode)
      .get();
    const devices = devicesSnapshot.docs.map((doc) => doc.data());
    const deviceFound = devices.some(
      (device) => device.combinedSerialNum === combinedSerialNum
    );
    if (deviceFound) {
      throw new Error("Device already exists.");
    }

    const usersRef = firestore().collection("users");
    const newUser = {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      createdAt: new Date().toISOString(),
    };
    await usersRef.doc(data.id).set(newUser);
    return newUser;
  } catch (error) {
    console.error("Error adding user data:", error);
    throw error;
  }
};

export const addDeviceToUserIOS = async (deviceId, macId, userId) => {
  // Get a reference to the users collection
  const usersRef = firestore().collection("users");
  // Get a reference to the document using the user ID
  const userRef = usersRef.doc(userId);
  // Get the document data
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new Error("User not found");
  }
  // User document exists
  const userData = userDoc.data();
  const devices = userData.devices || {}; // Get devices array, or create empty array if not exists

  // Check if the device already exists in the array
  const deviceExists = devices?.deviceId;

  if (!deviceExists) {
    // Add the device to the array
    await userRef.update({
      devices: { ...devices, [deviceId]: [macId] },
    });
    console.log("Device added successfully");
  } else {
    if (!deviceExists.includes(macId)) {
      // Add the device to the array
      await userRef.update({
        devices: { ...devices, [deviceId]: [...deviceExists, macId] },
      });
      console.log("Device added successfully");
    } else {
      console.log("Device already exists");
    }
  }
};
export const getUserById = async (userId) => {
  try {
    const userRef = firestore().collection("users").doc(userId);
    const doc = await userRef.get();

    if (doc.exists) {
      return doc.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const checkIfUserExistsByPhone = async (phoneNum) => {
  try {
    const users = await firestore()
      .collection("users")
      .where("phoneNumber", "==", phoneNum)
      .get();

    if (users.size > 0) {
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
