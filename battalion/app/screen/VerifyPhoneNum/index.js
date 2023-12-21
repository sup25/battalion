import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useRef, useEffect, useState } from "react";
import { auth } from "../../config/Firebase/Firebase";
import { addUserToFirestore } from "../../config/UsersCollection/UsersCollection";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import colors from "../../config/Colors/colors";
import CarthagosButton from "../../component/CarthagosButton/CarthagosButton";
import { PhoneAuthProvider } from "firebase/auth";
import { useAuth } from "../../utils/AuthProvider/AuthProvider";
import { useToast } from "react-native-toast-notifications";
import firebaseConfigWeb from "../../config/FireBaseConfigWeb";

const VerifyPhoneNum = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const { currentUser } = useAuth();
  const recaptchaVerifier = useRef(null);
  const toast = useToast();

  const handleSendVerificationCode = async (setIsLoading) => {
    setIsLoading(true);
    try {
      const fullPhoneNumber = countryCode + phoneNumber;
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(
        fullPhoneNumber,
        recaptchaVerifier.current
      );
      console.log("PNum", fullPhoneNumber);

      toast.show("Success: Verification code has been sent to your phone", {
        type: "normal",
      });

      const user = currentUser;

      if (user) {
        const userData = {
          phoneNumber: fullPhoneNumber,
        };
        const addedToFirestore = await addUserToFirestore(user.uid, userData);

        if (!addedToFirestore) {
          setIsLoading(false);
          console.error("Failed to add phone number to Firestore.");
        }
      } else {
        setIsLoading(false);

        toast.show("Error: User is not logged in.", {
          type: "normal",
        });
      }

      navigation.navigate("ConfirmCode", {
        verificationId,
        phoneNumber: fullPhoneNumber,
        countryCode: countryCode,
      });
    } catch (error) {
      setIsLoading(false);

      toast.show(`Error: ${error.message}`, {
        type: "normal",
      });
    }
  };
  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfigWeb}
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
            onChangeText={setCountryCode}
          />
          <TextInput
            style={styles.phoneNumberInput}
            autoCompleteType="tel"
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            onChangeText={setPhoneNumber}
          />
        </View>
      </View>
      <View style={styles.btn}>
        <CarthagosButton
          title="confirm"
          width={277}
          textColor={colors.white}
          onPress={(setIsLoading) => handleSendVerificationCode(setIsLoading)}
        />
      </View>
    </View>
  );
};

export default VerifyPhoneNum;

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 15,
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
    paddingHorizontal: 15,
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
    maxWidth: 170,
  },
});
