import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

const db = getFirestore();

const writeUserData = async (data) => {
  const { id, product_code, model, serial_number, specs, user } = data;
  const userRef = doc(db, "Models", user);

  try {
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      console.log("Barcode already exists. Cannot update other data.");
      return;
    }

    await setDoc(userRef, {
      id: id,
      product_code: product_code,
      model: model,
      serial_number: serial_number,
      specs: specs,
      user: user,
    });

    console.log("Data saved successfully");
  } catch (error) {
    console.log("Error saving data:", error);
  }
};

export default writeUserData;
