import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useRef, useEffect, useState } from "react";
import { auth } from "../authentication/Firebase";

import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import colors from "../config/colors";
import CarButton from "../component/CarButton";
import { PhoneAuthProvider } from "firebase/auth";

const VerifyPhoneOne = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const recaptchaVerifier = useRef(null);
  const [info, setInfo] = useState("");

  const firebaseConfig = {
    apiKey: "AIzaSyCOB7BcSJL0z46RG_8VET7R3axYekDBY2M",
    authDomain: "fir-auth-3f578.firebaseapp.com",
    databaseURL: "https://fir-auth-3f578-default-rtdb.firebaseio.com",
    projectId: "fir-auth-3f578",
    storageBucket: "fir-auth-3f578.appspot.com",
    messagingSenderId: "255101624190",
    appId: "1:255101624190:web:32883f32d3db47fa3d1d2f",
  };
  const handleSendVerificationCode = async () => {
    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier.current
      );
      const message = "Success: Verification code has been sent to your phone";
      setInfo(message);
      console.log("Message:", message); // If Ok, show message.

      navigation.navigate("ConfirmCode", {
        verificationId,
        phoneNumber: phoneNumber,
      });
    } catch (error) {
      setInfo(`Error: ${error.message}`);
    }
  };
  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      />
      <View style={styles.containerSmall}>
        <Text style={styles.txtFirst}>Verify your phone with a code</Text>
        <Text style={styles.txtSecond}>
          We’ll send you a code to keep your account secure
        </Text>
        <View style={styles.txtInputContainer}>
          <TextInput style={styles.txtInputPhoneNumber} defaultValue="+1" />
          <TextInput
            style={styles.txtInput}
            autoCompleteType="tel"
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
          />
        </View>
        <Text style={styles.info}>{info}</Text>
      </View>
      <View style={styles.btn}>
        <CarButton
          title="confirm"
          width={277}
          textColor={colors.white}
          onPress={handleSendVerificationCode}
        />
      </View>
    </View>
  );
};

export default VerifyPhoneOne;

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 20,
    marginTop: 300,
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
    width: 250,
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
  txtInputPhoneNumber: {
    width: 50,
    backgroundColor: "#1E1E1E",
    color: colors.white,
    borderRadius: 5,
    height: 55,
    alignSelf: "center",
    marginTop: 31,
    padding: 10,
    fontSize: 24,
  },
  txtInputContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  txtFirst: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 500,
    textAlign: "center",
    maxWidth: 181,
    alignItems: "center",
  },
  txtSecond: {
    color: "#8F8F8F",
    fontSize: 16,
    fontWeight: 400,
    textAlign: "center",
    marginTop: 8,
    maxWidth: 170,
  },
});
