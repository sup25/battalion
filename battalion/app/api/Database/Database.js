import firestore from "@react-native-firebase/firestore";
import { db } from "../../config/Firebase/Firebase";

const addUserToDevice = async (deviceId, userId) => {
  try {
    // Get a reference to the devices collection
    const devicesRef = firestore().collection("devices");
    // Get a reference to the document using the device ID
    const deviceRef = devicesRef.doc(deviceId);
    // Get the document data
    const deviceDoc = await deviceRef.get();

    if (!deviceDoc.exists) {
      throw new Error("Device not found");
    }

    // Get a reference to the users collection
    const usersRef = firestore().collection("users");
    // Get a reference to the document using the user ID
    const userRef = usersRef.doc(userId);
    // Get the document data
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new Error("User not found");
    }

    const isUserExistInUsersArr = deviceDoc
      .data()
      .users.find((user) => user.id === userId);

    const updatedUsersIds = [...deviceDoc.data().usersIds, userId];
    if (!isUserExistInUsersArr) {
      // Add the user to the device's users array
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

    return deviceDoc.data()?.owner?.id === data.owner;
  } catch (error) {
    throw error;
  }
};

export const getOwnerAllDevices = async (ownerId) => {
  try {
    // Get a reference to the devices collection
    const devicesRef = firestore().collection("devices");
    // Query devices based on the owner ID
    const query = devicesRef.where("owner.id", "==", ownerId);
    // Get the documents that match the query
    const querySnapshot = await query.get();

    // Extract data from the documents
    const devices = [];
    querySnapshot.forEach((doc) => {
      devices.push({ id: doc.id, ...doc.data() });
    });
    return devices;
  } catch (error) {
    console.error("Error getting devices:", error);
    throw error;
  }
};

export const getUserAllDevices = async (ownerId) => {
  try {
    // Get a reference to the devices collection
    const devicesRef = firestore().collection("devices");
    // Query devices based on the owner ID
    const query = devicesRef.where("usersIds", "array-contains", ownerId);
    // Get the documents that match the query
    const querySnapshot = await query.get();

    // Extract data from the documents
    const devices = [];
    querySnapshot.forEach((doc) => {
      devices.push({ id: doc.id, ...doc.data() });
    });
    return devices;
  } catch (error) {
    console.error("Error getting devices:", error);
    throw error;
  }
};

// export const updateDeviceMacId = async (deviceId, deviceMacId) => {
//   try {
//     const deviceRef = doc(db, "devices", deviceId);

//     // Update the device with its own ID as mac_id
//     await setDoc(deviceRef, { mac_id: deviceMacId }, { merge: true });

//     console.log("Device updated successfully!");

//     // Fetch and return the updated device document
//     const updatedDeviceSnapshot = await getDoc(deviceRef);

//     if (updatedDeviceSnapshot.exists()) {
//       // Access the updated device data
//       const updatedDeviceData = updatedDeviceSnapshot.data();
//       return updatedDeviceData;
//     } else {
//       throw new Error("Device not found after update");
//     }
//   } catch (error) {
//     console.error("Error updating device:", error);
//     throw error;
//   }
// };

export const storeFourDigitsToTheDb = async (
  combinedSerialNum,
  digitValuesAsNumbers,
  setPasswordError = false
) => {
  try {
    if (combinedSerialNum) {
      // Get a reference to the devices collection
      const devicesRef = firestore().collection("devices");
      // Update the document with the new password
      await devicesRef.doc(combinedSerialNum).update({
        fourDigitCode: digitValuesAsNumbers,
      });
    }
  } catch (error) {
    if (setPasswordError) {
      setPasswordError(
        "Error storing password to the database, please check your internet connection."
      );
    }
    throw error;
  }
};

export const checkIfUserHasPermissionToConnect = async (ownerId, deviceId) => {
  try {
    // Get a reference to the devices collection
    const devicesRef = firestore().collection("devices");
    // Query devices based on the owner ID
    const query = devicesRef
      .where("usersIds", "array-contains", ownerId)
      .where("deviceId", "==", deviceId);

    // Get the documents that match the query
    const querySnapshot = await query.get();

    // Extract data from the documents
    const devices = [];
    querySnapshot.forEach((doc) => {
      devices.push({ id: doc.id, ...doc.data() });
    });

    return devices.length > 0 ? devices[0] : false;
  } catch (error) {
    console.error("Error getting devices:", error);
    throw error;
  }
};

export const checkIfUserIsOwner = async (ownerId, deviceId) => {
  try {
    // Get a reference to the devices collection
    const devicesRef = firestore().collection("devices");
    // Query devices based on the owner ID
    const query = devicesRef
      .where("deviceId", "==", deviceId)
      .where("owner.id", "==", ownerId);

    // Get the documents that match the query
    const querySnapshot = await query.get();

    // Extract data from the documents
    return querySnapshot.size > 0 ? true : false;
  } catch (error) {
    console.error("Error getting devices:", error);
    throw error;
  }
};

export const getDeviceUsers = async (deviceId, isOwner) => {
  if (isOwner) {
    if (deviceId) {
      try {
        // Get a reference to the devices collection
        const devicesRef = firestore().collection("devices");
        // Query devices based on the owner ID
        const query = devicesRef.where("deviceId", "==", deviceId);

        // Get the documents that match the query
        const querySnapshot = await query.get();

        // Extract data from the documents
        const devices = [];
        querySnapshot.forEach((doc) => {
          devices.push({ id: doc.id, ...doc.data() });
        });
        if (devices.length > 0) {
          return devices[0].users;
        } else {
          throw new Error("Device not found");
        }
      } catch (error) {
        console.error("Error getting devices:", error);
        throw error;
      }
    }
    throw new Error("Device not found");
  }
};
export const aproveUser = async (deviceId, userId) => {
  // Get a reference to the devices collection
  const devicesRef = firestore().collection("devices");
  // Get a reference to the query using the device ID
  const deviceRef = devicesRef.where("deviceId", "==", deviceId);
  // Get the query snapshot using the device ID and limit to one result
  const device = await deviceRef.limit(1).get();
  // Get the first document change in the snapshot
  const deviceChange = device.docChanges()[0];
  // Get the document data
  const deviceData = deviceChange.doc.data();
  // Get the document reference
  const deviceDocRef = deviceChange.doc.ref;

  const existingUserIndex = deviceData.users.findIndex(
    (user) => user.id === userId
  );
  // Add the new userId and user object
  const updatedUsersIds = [...deviceData.usersIds, userId];
  // Replace the existing user object with the updated one
  deviceData.users[existingUserIndex] = {
    ...deviceData.users[existingUserIndex],
    approved: true,
    status: "approved",
  };
  // Update the document
  await deviceDocRef.update({
    usersIds: updatedUsersIds,
    users: deviceData.users,
  });
};

export const rejectUser = async (deviceId, userId) => {
  // Get a reference to the devices collection
  const devicesRef = firestore().collection("devices");
  // Get a reference to the query using the device ID
  const deviceRef = devicesRef.where("deviceId", "==", deviceId);
  // Get the query snapshot using the device ID and limit to one result
  const device = await deviceRef.limit(1).get();
  // Get the first document change in the snapshot
  const deviceChange = device.docChanges()[0];
  // Get the document data
  const deviceData = deviceChange.doc.data();
  // Get the document reference
  const deviceDocRef = deviceChange.doc.ref;
  // Filter out the existing userId and user object
  const filteredUsers = deviceData.users.filter((user) => user.id !== userId);
  // Add the new userId and user object

  const updatedUsers = [
    ...filteredUsers,

    {
      ...deviceData.users.find((user) => user.id === userId),
      approved: false,
      status: "rejected",
    },
  ];
  // Update the document
  await deviceDocRef.update({
    users: updatedUsers,
  });
};

export const disconnectUser = async (deviceId, userId) => {
  // Get a reference to the devices collection
  const devicesRef = firestore().collection("devices");
  // Get a reference to the query using the device ID
  const deviceRef = devicesRef.where("deviceId", "==", deviceId);
  // Get the query snapshot using the device ID and limit to one result
  const device = await deviceRef.limit(1).get();
  // Get the first document change in the snapshot
  const deviceChange = device.docChanges()[0];
  // Get the document data
  const deviceData = deviceChange.doc.data();
  // Get the document reference
  const deviceDocRef = deviceChange.doc.ref;
  // Filter out the existing userId and user object
  const filteredUsersIds = deviceData.usersIds.filter((id) => id !== userId);
  const filteredUsers = deviceData.users.filter((user) => user.id !== userId);
  // Add the new userId and user object
  const updatedUsersIds = filteredUsersIds;
  const updatedUsers = [
    ...filteredUsers,

    {
      ...deviceData.users.find((user) => user.id === userId),
      approved: false,
      status: "disconnected",
    },
  ];
  // Update the document
  await deviceDocRef.update({
    usersIds: updatedUsersIds,
    users: updatedUsers,
  });
};

export const setNameToDevice = async (name, deviceId) => {
  // Add the 'name' parameter
  const deviceRef = firestore()
    .collection("devices")
    .where("deviceId", "==", deviceId);
  try {
    await deviceRef.get().then((querySnapshot) => {
      // Use 'get' instead of 'update' to fetch the document
      querySnapshot.forEach((doc) => {
        doc.ref.update({
          name: name, // Update the 'name' field with the provided value
        });
      });
    });
    return true;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};
