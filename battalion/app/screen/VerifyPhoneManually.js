import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import colors from "../config/colors";
import CarthagosButton from "../component/CarthagosButton";
import AddUserData from "../config/Database";

import { useAuth } from "../utils/AuthProvider";

const VerifyPhoneManually = ({ navigation, route }) => {
  const { currentUser } = useAuth();
  const userName = currentUser?.displayName;

  const [displayMessage, setDisplayMessage] = useState("");

  const [userData, setUserData] = useState({
    combinedSerialNum: "",
  });

  const handleConfirm = async () => {
    const { combinedSerialNum } = userData;
  
    // Validate the combinedSerialNum field
    if (!combinedSerialNum || combinedSerialNum.length !== 12) {
      const message =
        "Invalid combinedSerialNum. Please enter a 12-digit value.";
      setDisplayMessage(message);
      return;
    }
  
    // Determine if the combinedSerialNum contains letters or numbers
    const isLetters = /^[A-Za-z]+$/.test(combinedSerialNum);
    const isNumbers = /^[0-9]+$/.test(combinedSerialNum);
  
    // Set the owner and users values in userData
    const updatedUserData = {
      ...userData,
      owner: userName,
      users: ["User1", "User2", "User3"],
      fourDigitCode: "",
      teamType: isLetters ? "Team A" : isNumbers ? "Team B" : "Uncategorized",
    };
  
    // Call AddUserData to send combinedSerialNum
    await AddUserData(updatedUserData);
  
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
      <View style={{ alignItems: "center", top: 20 }}>
        <Text
          onPress={() => {
            navigation.navigate("fourdigitcodeinsertscreen",{
              combinedSerialNum: userData.combinedSerialNum,
            });
          }}
          style={styles.InserCodetxt}
        >
          Insert code
        </Text>
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
  InserCodetxt: {
    color: colors.medium,
    fontSize: 14,
    fontWeight: 500,
    alignItems: "center",
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
