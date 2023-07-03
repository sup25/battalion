import React, { useState } from "react";
import CarButton from "../component/CarButton";
import { StyleSheet, View, TextInput, Text } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../authentication/Firebase";
import colors from "../config/colors";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [errormsg, setErrorMsg] = useState("");

  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setEmailSent(true);
      })
      .catch((error) => {
        if (error.code === "auth/user-not-found") {
          setErrorMsg("User Not Found");
        } else {
          setErrorMsg(error.message);
        }
      });
    setTimeout(() => {
      setErrorMsg("");
    }, 3000);
  };
  const handleBackto = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      {emailSent ? (
        <>
          <Text style={styles.emailSentText}>
            Password reset email has been sent.
          </Text>
          <CarButton title=" Back To home" onPress={handleBackto} />
        </>
      ) : (
        <>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errormsg ? <Text style={styles.errorText}>{errormsg}</Text> : null}

          <CarButton title="Reset Password" onPress={handleResetPassword} />
        </>
      )}
    </View>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.black,
    padding: 20,
  },
  emailSentText: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.white,
  },
  errorText: {
    color: colors.primary,
    marginBottom: 10,
    fontSize: 24,
  },

  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 5,
    width: "100%",
    marginVertical: 20,
  },
});
