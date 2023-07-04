import { getDatabase, ref, set, child, get } from "firebase/database";

const db = getDatabase();

const writeUserData = (barcode, model, user) => {
  const stackRef = ref(db, "Users/" + user);

  // Check if barcode exists before updating data
  get(child(stackRef, "barcode"))
    .then((snapshot) => {
      const existingBarcode = snapshot.val();

      if (existingBarcode) {
        console.log("Barcode already exists. Cannot update other data.");
        return;
      }

      set(stackRef, {
        barcode: barcode,
        model: model,
        user: user,
      })
        .then(() => {
          console.log("Data saved successfully");
        })
        .catch((error) => {
          console.log("Error saving data:", error);
        });
    })
    .catch((error) => {
      console.log("Error checking barcode:", error);
    });
};

export default writeUserData;
