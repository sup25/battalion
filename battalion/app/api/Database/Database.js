import firestore from "@react-native-firebase/firestore";
import { db } from "../../config/Firebase/Firebase";

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

    if (deviceDoc.exists) {
      console.log("Device data already exists. Cannot update.");
      throw new Error("Device data already exists. Cannot update.");
    }
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
    await deviceRef.set({
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

    console.log("Device data saved successfully");
  } catch (error) {
    console.log("Error saving device data:", error.message);
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
    // Get a reference to the devices collection
    const devicesRef = firebase.firestore().collection("devices");
    // Update the document with the new password
    await devicesRef.doc(combinedSerialNum).update({
      fourDigitCode: digitValuesAsNumbers,
    });
  } catch (error) {
    if (setPasswordError) {
      setPasswordError(
        "Error storing password to the database, please check your internet connection."
      );
    }
    throw error;
  }
};
