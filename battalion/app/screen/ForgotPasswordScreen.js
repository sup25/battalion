import React, { useState } from "react";
import CarButton from "../component/CarButton";
import { StyleSheet, View, TextInput, Text } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../authentication/Firebase";
import colors from "../config/colors";
import TextLogo from "../assets/TextLogo";
import Screen from "../component/Screen";
import CarLinkButton from "../component/CarLinkButton";

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
    <Screen style={styles.container} behavior="height">
      {emailSent ? (
        <>
          <View style={{ alignItems: "center", marginTop: 200 }}>
            <Text style={styles.emailSentText}>
              Password reset email has been sent.
            </Text>
            <CarButton
              title=" Back To home"
              onPress={handleBackto}
              width={277}
            />
          </View>
        </>
      ) : (
        <>
          <View style={styles.textLogo}>
            <View style={styles.logoContainer}>
              <TextLogo />
              <Text style={styles.title}>Forgot Password?</Text>
            </View>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#656565"
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errormsg ? <Text style={styles.errorText}>{errormsg}</Text> : null}
          </View>
          <View style={styles.btnContainer}>
            <CarLinkButton
              navigation={navigation}
              onPress={handleResetPassword}
              title="Submit"
              mainDesc="Already Have an account? "
              desc="Login"
              width={277}
              loginRoute="Login"
              textColor="white"
            />
          </View>
        </>
      )}
    </Screen>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  btnContainer: {
    alignItems: "center",
    marginTop: 287,
  },
  container: {
    flex: 1,
    backgroundColor: colors.black,
    paddingHorizontal: 20,
  },
  emailSentText: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.white,
  },
  errorText: {
    color: colors.primary,
    marginBottom: 10,
    fontSize: 14,
  },

  input: {
    borderColor: colors.secondary,
    fontSize: 18,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 38,
    width: 283,
    marginVertical: 20,
    height: 50,
    color: "#656565",
  },
  logoContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
  },

  textLogo: {
    width: "100%",
    alignItems: "center",
    marginTop: 66,
  },
  title: {
    fontSize: 24,
    fontWeight: 500,
    color: colors.white,
    marginTop: 18,
  },
});
