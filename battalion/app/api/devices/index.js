import firestore from "@react-native-firebase/firestore";

export const addDevice = async (
  combinedSerialNum,
  deviceId = "DA:38:68:87:AB:C4"
) => {
  const trimmedSerialNum = combinedSerialNum.toString().trim();
  const devicesRef = firestore().collection("devices");
  const deviceDoc = await devicesRef.doc(trimmedSerialNum).get();
  if (deviceDoc.exists) {
    throw new Error("Device already exist");
  }
  const isValid = /^(\d{12})?$/.test(trimmedSerialNum);
  const modelNum = trimmedSerialNum.substring(0, 4);
  const prodDate = trimmedSerialNum.substring(4, 8);
  const serialNum = trimmedSerialNum.substring(8, 12);
  const remaining = trimmedSerialNum.substring(0, 12);
  const device = {
    name: `Battalion #${trimmedSerialNum}`,
    deviceId,
    modelNum,
    prodDate,
    serialNum,
    combinedSerialNum: remaining,
    users: [],
    teamType: isValid ? "Valid" : "Invalid",
  };

  await devicesRef.doc(trimmedSerialNum).set(device);
};

export const getOwnerAllDevices = async (ownerId) => {
  try {
    const devicesRef = firestore().collection("devices");
    const query = devicesRef.where("owner.id", "==", ownerId);
    const querySnapshot = await query.get();
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
    const devicesRef = firestore().collection("devices");
    const query = devicesRef.where("usersIds", "array-contains", ownerId);
    const querySnapshot = await query.get();
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

export const storeFourDigitsToTheDb = async (
  combinedSerialNum,
  digitValuesAsNumbers,
  setPasswordError = false
) => {
  try {
    if (combinedSerialNum) {
      const devicesRef = firestore().collection("devices");
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
export const checkIfUserHasPermissionToConnect = async (
  ownerId,
  deviceSerialNumber
) => {
  try {
    const devicesRef = firestore().collection("devices");
    const query = devicesRef
      .where("usersIds", "array-contains", ownerId)
      .where("combinedSerialNum", "==", deviceSerialNumber);
    const querySnapshot = await query.get();
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
    const devicesRef = firestore().collection("devices");
    const query = devicesRef
      .where("combinedSerialNum", "==", deviceId)
      .where("owner.id", "==", ownerId);
    const querySnapshot = await query.get();
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
        const devicesRef = firestore().collection("devices");
        const query = devicesRef.where("combinedSerialNum", "==", deviceId);
        const querySnapshot = await query.get();
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

export const setNameToDevice = async (name, deviceId) => {
  try {
    await firestore().collection("devices").doc(deviceId).update({
      name,
    });
    return true;
  } catch (error) {
    throw new Error(error);
  }
};

export const aproveUser = async (deviceId, userId) => {
  const devicesRef = firestore().collection("devices");
  const deviceRef = devicesRef.where("combinedSerialNum", "==", deviceId);
  const device = await deviceRef.limit(1).get();
  const deviceChange = device.docChanges()[0];
  const deviceData = deviceChange.doc.data();
  const deviceDocRef = deviceChange.doc.ref;
  const existingUserIndex = deviceData.users.findIndex(
    (user) => user.id === userId
  );
  const updatedUsersIds = [...deviceData.usersIds, userId];
  deviceData.users[existingUserIndex] = {
    ...deviceData.users[existingUserIndex],
    approved: true,
    status: "approved",
  };
  await deviceDocRef.update({
    usersIds: updatedUsersIds,
    users: deviceData.users,
  });
};

export const rejectUser = async (deviceId, userId) => {
  const devicesRef = firestore().collection("devices");
  const deviceRef = devicesRef.where("combinedSerialNum", "==", deviceId);
  const device = await deviceRef.limit(1).get();
  const deviceChange = device.docChanges()[0];
  const deviceData = deviceChange.doc.data();
  const deviceDocRef = deviceChange.doc.ref;
  const filteredUsers = deviceData.users.filter((user) => user.id !== userId);
  const updatedUsers = [
    ...filteredUsers,
    {
      ...deviceData.users.find((user) => user.id === userId),
      approved: false,
      status: "rejected",
    },
  ];
  await deviceDocRef.update({
    users: updatedUsers,
  });
};

export const disconnectUser = async (deviceId, userId) => {
  const devicesRef = firestore().collection("devices");
  const deviceRef = devicesRef.where("combinedSerialNum", "==", deviceId);
  const device = await deviceRef.limit(1).get();
  const deviceChange = device.docChanges()[0];
  const deviceData = deviceChange.doc.data();
  const deviceDocRef = deviceChange.doc.ref;
  const filteredUsersIds = deviceData.usersIds.filter((id) => id !== userId);
  const filteredUsers = deviceData.users.filter((user) => user.id !== userId);
  const updatedUsersIds = filteredUsersIds;
  const updatedUsers = [
    ...filteredUsers,
    {
      ...deviceData.users.find((user) => user.id === userId),
      approved: false,
      status: "disconnected",
    },
  ];
  await deviceDocRef.update({
    usersIds: updatedUsersIds,
    users: updatedUsers,
  });
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
