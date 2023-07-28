import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../config/Firebase";

const writeUserData = async (data) => {
  const { combinedSerialNum } = data;

  try {
    // Validate the owner field
    if (!data.owner) {
      throw new Error("Owner field is required.");
    }

    // Extract the four parts from the combinedSerialNum
    const modelNum = combinedSerialNum.substring(0, 4);
    const prodDate = combinedSerialNum.substring(4, 8);
    const serialNum = combinedSerialNum.substring(8, 12);
    const remaining = combinedSerialNum.substring(0, 12);

    // Format the prodDate as "DD/MM" (e.g., "23/07")
    const formattedProdDate = prodDate.replace(/(\d{2})(\d{2})/, "$1/$2");

    // Create the document reference using combinedSerialNum
    const deviceRef = doc(collection(db, "devices"), combinedSerialNum);
    const deviceDoc = await getDoc(deviceRef);

    if (deviceDoc.exists()) {
      console.log("Device data already exists. Cannot update.");
      return;
    }

    await setDoc(deviceRef, {
      modelNum,
      prodDate: formattedProdDate,
      serialNum,
      combinedSerialNum: remaining,
      owner: data.owner,
      users: data.users,
    });

    console.log("Device data saved successfully");
  } catch (error) {
    console.log("Error saving device data:", error.message);
  }
};

export default writeUserData;
