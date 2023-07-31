import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import {
  PhoneAuthProvider,
  linkWithCredential,
  updateProfile,
} from "firebase/auth";

import { auth } from "../config/Firebase";
import colors from "../config/colors";
import CarthagosButton from "../component/CarthagosButton";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "../utils/AuthProvider";

const InsertCode = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [info, setInfo] = useState("");
  const [verificationId, setVerificationID] = useState("");
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const route = useRoute();

  // Create refs for each text input field
  const inputRefs = [];
  for (let i = 0; i < 6; i++) {
    inputRefs[i] = useRef(null);
  }

  // Extract the verificationId from the route parameters
  useEffect(() => {
    if (route.params && route.params.verificationId) {
      setVerificationID(route.params.verificationId);
    }
  }, [route.params]);

  const handleVerifyVerificationCode = async () => {
    try {
      const code = verificationCode.join(""); // Join the digits to get the complete 6-digit code
      const credential = PhoneAuthProvider.credential(verificationId, code);
      await linkWithCredential(currentUser, credential);

      // Update the user's profile with the phone number
      await updateProfile(auth.currentUser, {
        email: currentUser?.email || "", // Update the email to the one from which the user signed up
        phoneNumber: currentUser?.phoneNumber || "", // Keep the existing phone number as it is already verified
      });

      const message = "Success: Phone authentication successful";
      setInfo(message);
      console.log("Message", message);
      navigation.navigate("Login");
    } catch (error) {
      setInfo(`Error: ${error.message}`);
    }
  };

  const handleChangeVerificationCode = (text, index) => {
    // Update the corresponding digit in the verificationCode array
    const newVerificationCode = [...verificationCode];
    newVerificationCode[index] = text;
    setVerificationCode(newVerificationCode);

    // Move focus to the next input field if the current one is full
    if (text && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerSmall}>
        <Text style={styles.txtFirst}>Insert Code</Text>
        <Text style={styles.txtSecond}>
          Enter the security code we sent to {currentUser?.phoneNumber || ""}
        </Text>
        <View style={styles.txtInputContainer}>
          {verificationCode.map((digit, index) => (
            <TextInput
              key={index}
              ref={inputRefs[index]} // Set the ref for each text input field
              style={styles.txtInput}
              value={digit}
              onChangeText={(text) => handleChangeVerificationCode(text, index)}
              maxLength={1}
              keyboardType="numeric"
              onSubmitEditing={() => {
                // Move focus to the next input field when Enter/Return is pressed
                if (index < 5) {
                  inputRefs[index + 1].current.focus();
                }
              }}
            />
          ))}
        </View>
        <Text style={styles.info}>{info}</Text>
        <CarthagosButton
          title="resend code"
          width={277}
          textColor={colors.black}
          color="white"
        />
      </View>
      <View style={styles.btn}>
        <CarthagosButton
          title="confirm"
          width={277}
          textColor={colors.white}
          onPress={handleVerifyVerificationCode}
        />
      </View>
    </View>
  );
};

export default InsertCode;

const styles = StyleSheet.create({
  btn: {
    marginTop: 247,
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  containerSmall: {
    width: "100%",
    marginTop: 76,
    alignItems: "center",
  },
  info: {
    fontSize: 24,
    color: colors.white,
  },
  txtInput: {
    width: 50,
    backgroundColor: "#1E1E1E",
    color: colors.white,
    borderRadius: 5,
    height: 55,
    alignSelf: "center",
    marginTop: 31,
    padding: 10,
    marginLeft: 10,
    fontSize: 24,
  },
  txtInputContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 27,
    justifyContent: "center",
  },
  txtFirst: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "500",
    textAlign: "center",
    maxWidth: 181,
    alignItems: "center",
  },
  txtSecond: {
    color: "#8F8F8F",
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 8,
    maxWidth: 200,
  },
});
