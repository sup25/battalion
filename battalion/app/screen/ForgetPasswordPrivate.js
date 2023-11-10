import React, { useState } from "react";
import CarthagosButton from "../component/CarthagosButton";
import { StyleSheet, View, TextInput, Text } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/Firebase";
import colors from "../config/colors";
import TextLogo from "../assets/TextLogo";
import { useAuth } from "../utils/AuthProvider";

const ForgotPasswordPrivate = ({ navigation }) => {
  const { currentUser, logout } = useAuth();

  const [email, setEmail] = useState("");

  const [errormsg, setErrorMsg] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleResetPassword = async () => {
    if (currentUser && currentUser.email && currentUser.email === email) {
      try {
        console.log("Sending reset email to:", email);
        await sendPasswordResetEmail(auth, email);
        setSuccessMessage("sent successfully");
      } catch (error) {
        setErrorMsg(error.message);
        console.log("Error message:", error.message);
      }
    } else {
      setErrorMsg("Invalid email or user not logged in");
    }
  };
  const handleInputFocus = () => {
    setErrorMsg("");
    setSuccessMessage("");
  };

  return (
    <View style={styles.container} behavior="height">
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
          onFocus={handleInputFocus}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          color="white"
        />
        {errormsg ? <Text style={styles.errorText}>{errormsg}</Text> : null}
        {successMessage ? (
          <Text style={styles.SuccessText}>{successMessage}</Text>
        ) : null}
      </View>
      <View style={styles.btnContainer}>
        <CarthagosButton
          onPress={handleResetPassword}
          title="Submit"
          width={277}
          textColor="white"
        />
        <CarthagosButton
          width={277}
          textColor="white"
          onPress={() => {
            logout();
          }}
          title="logout"
        />
      </View>
    </View>
  );
};

export default ForgotPasswordPrivate;

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
  SuccessText: {
    color: "green",
    marginBottom: 10,
    fontSize: 14,
  },

  textLogo: {
    width: "100%",
    alignItems: "center",
    marginTop: 66,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    color: colors.white,
    marginTop: 18,
  },
});
