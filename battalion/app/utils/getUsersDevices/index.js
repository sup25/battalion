import {
  getOwnerAllDevices,
  getUserAllDevices,
  getUserFromDb,
} from "../../api/Database/Database";

function removeDuplicates(array1, array2) {
  const uniqueObjects = [];
  const ids = new Set();

  // Iterate over array1
  array1.forEach((obj) => {
    // Check if the id is not present in array2
    if (!ids.has(obj.id)) {
      // If not present, add the object to uniqueObjects
      uniqueObjects.push(obj);
      // Add this id to the set to prevent duplicates
      ids.add(obj.id);
    }
  });

  // Iterate over array2
  array2.forEach((obj) => {
    // Check if the id is not already present
    if (!ids.has(obj.id)) {
      // If not present, add the object to uniqueObjects
      uniqueObjects.push(obj);
      // Add this id to the set to prevent duplicates
      ids.add(obj.id);
    }
  });

  return uniqueObjects;
}

export const getUsersDevices = async (
  ownerId,
  connectedDevice,
  setDevices,
  setIsLoaded,
  isLocked = false,
  temp = false,
  boxBatteryLevel = false,
  OS = "android",
  serialNum
) => {
  try {
    const ownerArray = await getOwnerAllDevices(ownerId);
    const userArray = await getUserAllDevices(ownerId);

    const combinedArr = removeDuplicates(ownerArray, userArray);
    const user = await getUserFromDb(ownerId);
    const newDevices = combinedArr.map((item) => {
      const isCurrentDevice =
        item.deviceId === connectedDevice?.device?.id ||
        user?.devices?.[connectedDevice?.device?.serialNum]?.includes(
          connectedDevice?.device?.id
        );

      if (
        connectedDevice?.device &&
        user?.devices?.[connectedDevice?.device?.serialNum]?.includes(
          connectedDevice?.device?.id
        )
      ) {
        item.deviceId = connectedDevice?.device?.id;
      } else if (OS === "android") {
        item.deviceId = user?.devices?.[item?.combinedSerialNum] || [];
      } else if (!item?.deviceId) {
        item.deviceId = "";
      }
      return {
        ...item,
        name: item?.name ? item.name : item.deviceId,
        isLocked: isCurrentDevice ? isLocked : false,
        isMain: isCurrentDevice ? true : false,
        isEnabled: true,
        temp: isCurrentDevice ? temp : false,
        batteryLevel: isCurrentDevice ? boxBatteryLevel : false,
      };
    });
    setDevices(newDevices);
    setIsLoaded(false);
  } catch (err) {
    setIsLoaded(false);
    console.log(err);
  }
};
