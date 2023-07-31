import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import colors from "../config/colors";
import CarthagosButton from "../component/CarthagosButton";
import AddUserData from "../config/Database";

import { useAuth } from "../utils/AuthProvider";

const VerifyPhoneManually = () => {
  const { currentUser } = useAuth();
  const userEmail = currentUser?.email;
  const userName = userEmail ? userEmail.split("@")[0] : "";
  const [displayMessage, setDisplayMessage] = useState("");
  const [userData, setUserData] = useState({
    combinedSerialNum: "",
  });

  const handleConfirm = () => {
    const { combinedSerialNum } = userData;

    // Validate the combinedSerialNum field
    if (!combinedSerialNum || combinedSerialNum.length !== 12) {
      const message =
        "Invalid combinedSerialNum. Please enter a 12-digit value.";
      setDisplayMessage(message);
      return;
    }

    // Set the owner and users values in userData
    const updatedUserData = {
      ...userData,
      owner: userName, // Set the owner to the current user's name
      users: ["User1", "User2", "User3"], // Replace with the desired users array
    };

    AddUserData(updatedUserData);
    console.log("Saving data:", updatedUserData);

    // Show success message
    const successMessage = "Data saved successfully!";
    setDisplayMessage(successMessage);

    // Clear the text input field
    setUserData({
      combinedSerialNum: "",
    });
  };

  const handleChangeText = (key, value) => {
    // Clear the success message when the user starts typing
    if (displayMessage) {
      setDisplayMessage("");
    }

    setUserData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerSmall}>
        <Text style={styles.txtFirst}>Insert Code Manually</Text>
        <Text style={styles.txtSecond}>Write in the field below</Text>
        <TextInput
          style={styles.txtInput}
          value={userData.combinedSerialNum}
          onChangeText={(value) => handleChangeText("combinedSerialNum", value)}
        />
        {displayMessage ? (
          <Text style={styles.message}>{displayMessage}</Text>
        ) : null}
      </View>
      <View style={styles.btn}>
        <CarthagosButton
          title="confirm"
          width={277}
          textColor={colors.white}
          onPress={handleConfirm}
        />
      </View>
    </View>
  );
};

export default VerifyPhoneManually;

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 20,
    marginTop: 337,
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  containerSmall: {
    width: "100%",
    marginTop: 76,
  },
  txtInput: {
    width: 283,
    backgroundColor: "#1E1E1E",
    color: colors.white,
    borderRadius: 5,
    height: 55,
    alignSelf: "center",
    marginTop: 31,
    padding: 10,
  },
  txtFirst: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 500,
    textAlign: "center",
  },
  txtSecond: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 400,
    textAlign: "center",
    marginTop: 8,
  },
  message: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
});
