import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
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

    // Create the document reference using combinedSerialNum
    const deviceRef = doc(collection(db, "devices"), data.combinedSerialNum);
    const deviceDoc = await getDoc(deviceRef);

    if (deviceDoc.exists()) {
      console.log("Device data already exists. Cannot update.");
      return;
    }
    const ownerUser = await getDoc(doc(collection(db, "users"), data.owner));
    if (!ownerUser.exists()) {
      throw new Error("Owner user not found.");
    }

    const ownerUserData = ownerUser.data();
    await setDoc(deviceRef, {
      modelNum,
      prodDate,
      serialNum,
      combinedSerialNum: remaining,
      fourDigitCode,
      owner: {
        id: data.owner,
        ...ownerUserData,
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
    // Reference to the Firestore collection where devices are stored
    const devicesCollection = collection(db, "devices");

    // Query devices based on the owner ID
    const q = query(devicesCollection, where("owner.id", "==", ownerId));

    // Get the documents that match the query
    const querySnapshot = await getDocs(q);

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

export const updateDeviceMacId = async (deviceId, deviceMacId) => {
  try {
    const deviceRef = doc(db, "devices", deviceId);

    // Update the device with its own ID as mac_id
    await setDoc(deviceRef, { mac_id: deviceMacId }, { merge: true });

    console.log("Device updated successfully!");

    // Fetch and return the updated device document
    const updatedDeviceSnapshot = await getDoc(deviceRef);

    if (updatedDeviceSnapshot.exists()) {
      // Access the updated device data
      const updatedDeviceData = updatedDeviceSnapshot.data();
      return updatedDeviceData;
    } else {
      throw new Error("Device not found after update");
    }
  } catch (error) {
    console.error("Error updating device:", error);
    throw error;
  }
};
