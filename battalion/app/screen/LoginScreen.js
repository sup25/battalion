import colors from "../config/colors";
import CarButton from "../component/CarButton";
import TextLogo from "../assets/TextLogo";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Screen from "../component/Screen";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../authentication/Firebase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginErrorMessage, setLoginErrorMessage] = useState("");

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Logged in with:", user.email);
        navigation.navigate("Home");
      })
      .catch((error) => {
        if (error.code === "auth/wrong-password") {
          setLoginErrorMessage(
            "User not found. Please check your email or password."
          );
        } else if (error.code === "auth/user-not-found") {
          setLoginErrorMessage("User does not exist.");
        } else {
          setLoginErrorMessage("Login failed. Please try again.");
        }
        console.log(error);
        setTimeout(() => {
          setLoginErrorMessage("");
        }, 3000);
      });
  };
  const handleForgotPassword = () => {
    navigation.navigate("ForgotPass");
  };

  return (
    <Screen style={[styles.container, { padding: 20 }]} behavior="height">
      <View style={styles.logoConatiner}>
        <TextLogo />
        <Text style={styles.title}>Login</Text>
      </View>
      <View style={styles.textS}>
        <TextInput
          style={[styles.input, { fontSize: 18 }]}
          placeholder="Email"
          placeholderTextColor="white"
          onChangeText={(text) => setEmail(text)}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={[styles.input, { fontSize: 18 }]}
          placeholderTextColor="white"
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
        />
        {loginErrorMessage ? (
          <Text style={styles.errorText}>{loginErrorMessage}</Text>
        ) : null}
      </View>
      <View style={styles.ButtonContainer}>
        <CarButton title="Login" onPress={handleLogin} />
        <View style={styles.footerText}>
          <Text style={styles.footerNormalText}>
            Don't have an account?{" "}
            <Text
              onPress={() => navigation.navigate("Register")}
              style={styles.footerLinkText}
            >
              Sign Up
            </Text>
          </Text>
        </View>

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: colors.primary,
    marginBottom: 10,
    fontSize: 24,
  },
  forgotPasswordText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 500,
    marginTop: 15,
    alignSelf: "flex-start",
  },
  footerText: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  footerNormalText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 400,
  },
  footerLinkText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 400,
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 15,
    width: "100%",
    borderRadius: 5,
    color: colors.white,
  },
  logoConatiner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ButtonContainer: {
    flex: 2,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    justifyContent: "flex-end",
    paddingBottom: 50,
  },
  textS: {
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    color: colors.white,
    marginTop: 18,
  },
});
