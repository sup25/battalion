import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./Firebase";

const AddUserData = async (data) => {
  const { fourDigitCode, combinedSerialNum} = data;
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

    await setDoc(deviceRef, {
      modelNum,
      prodDate,
      serialNum,
      combinedSerialNum: remaining, 
      fourDigitCode,
      owner: data.owner,
      users: data.users,
      teamType, 
    });

    console.log("Device data saved successfully");
  } catch (error) {
    console.log("Error saving device data:", error.message);
  }
};

export default AddUserData;
