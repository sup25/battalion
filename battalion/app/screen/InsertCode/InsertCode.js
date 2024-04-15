import React, { useState, useEffect, useRef } from "react";
import { BackHandler, StyleSheet, Text, TextInput, View } from "react-native";
import auth from "@react-native-firebase/auth";
import colors from "../../config/Colors/colors";
import CarthagosButton from "../../component/CarthagosButton/CarthagosButton";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "../../utils/AuthProvider/AuthProvider";
import { useToast } from "react-native-toast-notifications";
import { addUserToFirestore } from "../../config/UsersCollection/UsersCollection";

const InsertCode = ({ navigation }) => {
  const toast = useToast();
  const route = useRoute();

  const { currentUser, modifyUser } = useAuth();
  const [verificationId, setVerificationID] = useState("");

  const [phoneNumber, setPhoneNumber] = useState(route.params.phoneNumber);
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  // Extract the verificationId from the route parameters
  useEffect(() => {
    if (route.params && route.params.confirmation) {
      setPhoneNumber(route.params.phoneNumber);
      setVerificationID(route.params.confirmation.verificationId);
    }
  }, [route.params]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      function () {
        return true; // Return false from the callback function
      }
    );

    return () => backHandler.remove(); // Clean up the event listener
  }, []);

  const handleResendCode = async (setIsLoading) => {
    setIsLoading(true);

    try {
      const fullPhoneNumber = `${phoneNumber}`;
      const confirmation = await auth().signInWithPhoneNumber(
        fullPhoneNumber,
        true
      );

      if (!confirmation.verificationId) {
        throw new Error("Invalid new verification ID");
      }

      // Set the new verification ID in the state
      setVerificationID(confirmation.verificationId);

      toast.show("Success: New verification code has been sent to your phone", {
        type: "normal",
      });
    } catch (error) {
      setIsLoading(false);
      toast.show("Error: invalid verification id", {
        type: "normal",
      });
      console.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Create refs for each text input field
  const inputRefs = [];
  for (let i = 0; i < 6; i++) {
    inputRefs[i] = useRef(null);
  }

  const handleVerifyVerificationCode = async (setIsLoading) => {
    setIsLoading(true);
    try {
      const code = verificationCode.join("");

      if (!currentUser.phoneNumber) {
        const credential = auth.PhoneAuthProvider.credential(
          route.params.confirmation.verificationId,
          code
        );

        await auth().currentUser.linkWithCredential(credential);
        await auth().currentUser.updateProfile({ phoneNumber });
      } else {
        // User is already linked to the phone provider
        console.log("User is already linked to the phone provider");
      }
      let userData = {};
      if (currentUser) {
        userData = {
          phoneNumber: phoneNumber,
        };
        const addedToFirestore = await addUserToFirestore(
          currentUser.uid,
          userData,
          true
        );
        modifyUser(userData);
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
      toast.show(" Phone authentication successful", {
        type: "normal",
      });
      navigation.navigate("privateRoute", { screen: "MainTabs" });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.show("Phone authentication unsuccessful, Please try again", {
        type: "normal",
      });
      console.log(`Error: ${error.message}`);
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
          Enter the security code we sent to {phoneNumber}
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
      </View>
      <View style={styles.btn}>
        <CarthagosButton
          title="confirm"
          width={277}
          textColor={colors.white}
          onPress={(setIsLoading) => handleVerifyVerificationCode(setIsLoading)}
        />
        <View style={{ display: "flex" }}>
          <CarthagosButton
            style={{ color: "white" }}
            textStyle={{ color: "white", textDecoration: "underline" }}
            title="Didn't receive verification code? resend code"
            textColor={colors.white}
            color="white"
            onPress={(setIsLoading) => handleResendCode(setIsLoading)}
          />
        </View>
      </View>
    </View>
  );
};

export default InsertCode;

const styles = StyleSheet.create({
  btn: {
    marginTop: 230,
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
    paddingHorizontal: 15,
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
