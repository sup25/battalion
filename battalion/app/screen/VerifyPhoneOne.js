import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useRef, useEffect, useState } from "react";
import { auth } from "../config/Firebase";
import { addUserToFirestore } from "../config/UsersCollection";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import colors from "../config/colors";
import CarthagosButton from "../component/CarthagosButton";
import { PhoneAuthProvider } from "firebase/auth";
import { useAuth } from "../utils/AuthProvider";
const VerifyPhoneOne = ({ navigation, setPhoneNum }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const { currentUser } = useAuth();
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
      const fullPhoneNumber = countryCode + phoneNumber;
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(
        fullPhoneNumber,
        recaptchaVerifier.current
      );
      const message = "Success: Verification code has been sent to your phone";
      setInfo(message);
      console.log("Message:", message);

      const user = currentUser;
      console.log(user);
      if (user) {
        const userData = {
          phoneNumber: fullPhoneNumber,
        };
        const addedToFirestore = await addUserToFirestore(user.uid, userData);

        if (addedToFirestore) {
          console.log("Phone number added to Firestore successfully.");
        } else {
          console.error("Failed to add phone number to Firestore.");
        }
      }

      navigation.navigate("ConfirmCode", {
        verificationId,
        phoneNumber: fullPhoneNumber,
      });

      setPhoneNum(phoneNumber);
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
          <TextInput
            style={styles.countryCodetxt}
            defaultValue={countryCode}
            onChangeText={(code) => setCountryCode(code)}
          />
          <TextInput
            style={styles.phoneNumberInput}
            autoCompleteType="tel"
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
          />
        </View>
        <Text style={styles.info}>{info}</Text>
      </View>
      <View style={styles.btn}>
        <CarthagosButton
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
  phoneNumberInput: {
    width: 230,
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
  countryCodetxt: {
    width: 70,
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
