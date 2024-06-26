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

export const addUserData = async (data) => {
  const { fourDigitCode, combinedSerialNum } = data;
  try {
    // Validate the owner field
    if (!data.owner) {
      throw new Error("Owner field is required.");
    }
    // Determine the team type
    const isLetters = /^[A-Za-z]+$/.test(combinedSerialNum);
    const isNumbers = /^[0-9]+$/.test(combinedSerialNum);
    const teamType = isLetters
      ? "Team A"
      : isNumbers
      ? "Team B"
      : "Uncategorized";

    // Extract the individual parts from the combinedSerialNum
    const modelNum = data.combinedSerialNum.substring(0, 4);
    const prodDate = data.combinedSerialNum.substring(4, 8);
    const serialNum = data.combinedSerialNum.substring(8, 12);
    const remaining = data.combinedSerialNum.substring(0, 12);

    // Get a reference to the devices collection
    const devicesRef = firestore().collection("devices");
    // Get a reference to the document using combinedSerialNum
    const deviceRef = devicesRef.doc(data.combinedSerialNum);
    // Get the document data
    const deviceDoc = await deviceRef.get();

    if (!deviceDoc.data()) {
      throw new Error("Device not found");
    }
    if (
      deviceDoc.data().usersIds &&
      deviceDoc.data()?.usersIds?.includes(data.owner)
    ) {
      throw new Error("This user is already added to the device.");
    }
    if (deviceDoc.data()) {
      if (deviceDoc.data()?.owner && deviceDoc.data()?.owner?.id !== null) {
        addUserToDevice(data.combinedSerialNum, data.owner);
      } else {
        // Get a reference to the users collection
        const usersRef = firestore().collection("users");
        // Get a reference to the document using owner id
        const ownerRef = usersRef.doc(data.owner);
        // Get the document data
        const ownerDoc = await ownerRef.get();

        if (!ownerDoc.exists) {
          throw new Error("Owner user not found.");
        }

        const ownerData = ownerDoc.data();
        // Set the document data using setDoc
        await deviceRef.update({
          modelNum,
          prodDate,
          serialNum,
          combinedSerialNum: remaining,
          fourDigitCode,
          owner: {
            id: data.owner,
            ...ownerData,
          },
          users: [],
          teamType,
        });

        // Add the user to the device's users array
        await deviceRef.update({
          usersIds: firestore.FieldValue.arrayUnion(data.owner),
        });
      }
    }

    return deviceDoc.data()?.owner ? false : true;
  } catch (error) {
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
