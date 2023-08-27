import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState,useRef } from "react";
import colors from "../config/colors";
import CarthagosButton from "../component/CarthagosButton";

import { collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../config/Firebase";

export default function FourDigitCodeInsertScreen({route}) {
  const [digitValues, setDigitValues] = useState(["", "", "", ""]);

/*   const combinedSerialNum = route.params?.combinedSerialNum || "";
 console.log("combinedSerialNum :",combinedSerialNum) */
 
 /* const combinedSerialNumRef = useRef(""); */

  const handleDigitChange = (index, value) => {
    const newDigitValues = [...digitValues];
    newDigitValues[index] = value;
    setDigitValues(newDigitValues);
  };

  const handleConfirm = async () => {
   /*  const combinedSerialNum = combinedSerialNumRef.current;  */
  
    const fourDigitCode = digitValues.join("");
    if (fourDigitCode.length !== 4) {
      console.log("Enter valid digit");
      return;
    }

    // Update the Firestore document with the new fourDigitCode
    try {
      const deviceRef = doc(collection(db, "devices"),"222222222222");
      await updateDoc(deviceRef, {
        fourDigitCode: fourDigitCode,
      });

      console.log("Four-digit code updated successfully");
    } catch (error) {
      console.log("Error updating four-digit code:", error.message);
    }

    // Reset the digitValues
    setDigitValues(["", "", "", ""]);
  };
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.heading}>4 digit password</Text>
        <Text style={styles.paragraph}>
          Input the password to unlock the box in the digital display, you can
          change this password later in the settings.
        </Text>
        <View style={styles.textInputContainer}>
          {digitValues.map((value, index) => (
            <TextInput
              key={index}
              style={styles.textInput}
              keyboardType="phone-pad"
              maxLength={1}
              value={value}
              onChangeText={(text) => handleDigitChange(index, text)}
            />
          ))}
        </View>
        <View style={styles.button}>
          <CarthagosButton
            title="confirm"
            textColor="white"
            width={277}
            onPress={handleConfirm}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "center",
    top: 247,
  },
  container: {
    flex: 1,
    backgroundColor: colors.black,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "500",
    lineHeight: 29,
    letterSpacing: -0.02,
    textAlign: "center",
    color: colors.white,
  },
  paragraph: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 19,
    color: "#8F8F8F",
    maxWidth: 300,
    textAlign: "center",
    marginTop: 8,
  },
  textInput: {
    height: 65,
    borderColor: colors.secondary,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 5,
    width: 61,
    borderRadius: 5,
    color: colors.white,
    fontSize: 24,
    display: "flex",
    textAlign: "center",
  },
  textInputContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 33,
  },
  wrapper: {
    justifyContent: "center",
    marginTop: 75,
  },
});
