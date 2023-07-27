import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import colors from "../config/colors";
import CarButton from "../component/CarButton";
import writeUserData from "../authentication/Database";

const VerifyPhoneManually = () => {
  const [userData, setUserData] = useState({
    combinedSerialNum: "",
  });

  const handleConfirm = () => {
    const { combinedSerialNum } = userData;

    // Validate the combinedSerialNum field
    if (!combinedSerialNum || combinedSerialNum.length !== 12) {
      console.log("Invalid combinedSerialNum. Please enter a 12-digit value.");
      return;
    }

    // Set the owner and users values in userData (hardcoded for now)
    userData.owner = "John Doe"; // Replace "John Doe" with the desired owner value
    userData.users = ["User1", "User2", "User3"]; // Replace with the desired users array

    writeUserData(userData);
    console.log("Saving data:", userData);
  };

  const handleChangeText = (key, value) => {
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
          onChangeText={(value) => handleChangeText("combinedSerialNum", value)}
        />
      </View>
      <View style={styles.btn}>
        <CarButton
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
});
