import { BackHandler, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useRef, useEffect, useState } from "react";

import {
  addUserToFirestore,
  checkIfUserExistsByPhone,
} from "../../config/UsersCollection/UsersCollection";
import colors from "../../config/Colors/colors";
import CarthagosButton from "../../component/CarthagosButton/CarthagosButton";
import auth from "@react-native-firebase/auth";
import { useAuth } from "../../utils/AuthProvider/AuthProvider";
import { useToast } from "react-native-toast-notifications";

const VerifyPhoneNum = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const { currentUser } = useAuth();
  const recaptchaVerifier = useRef(null);
  const toast = useToast();

  // Handle login
  function onAuthStateChanged(user) {
    if (user) {
      // Some Android devices can automatically process the verification code (OTP) message, and the user would NOT need to enter the code.
      // Actually, if he/she tries to enter it, he/she will get an error message because the code was already used in the background.
      // In this function, make sure you hide the component(s) for entering the code and/or navigate away from this screen.
      // It is also recommended to display a message to the user informing him/her that he/she has successfully logged in.
    }
  }

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      function () {
        return true; // Return false from the callback function
      }
    );

    return () => backHandler.remove(); // Clean up the event listener
  }, []);
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const handleSendVerificationCode = async (setIsLoading) => {
    setIsLoading(true);

    try {
      const fullPhoneNumber = `${countryCode} ${phoneNumber.substring(
        0,
        3
      )}-${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6)}`;

      const isPhoneNumberInUse = await checkIfUserExistsByPhone(
        fullPhoneNumber
      );

      if (isPhoneNumberInUse) {
        toast.show("Number in use. Please choose another number.", {
          type: "normal",
        });
      }

      toast.show("Success: Verification code has been sent to your phone", {
        type: "normal",
      });

      const confirmation = await auth().signInWithPhoneNumber(fullPhoneNumber);
      console.log("Verification ID sent:", confirmation.verificationId);
      navigation.navigate("ConfirmCode", {
        confirmation,
        phoneNumber: fullPhoneNumber,
        countryCode: countryCode,
      });
    } catch (error) {
      setIsLoading(false);

      toast.show(`${error.message}`, {
        type: "normal",
      });
      console.log("error msg", error.message);
    }
  };

  return (
    <View style={styles.container}>
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
