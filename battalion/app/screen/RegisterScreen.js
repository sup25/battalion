import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import colors from "../config/colors";

import Logo from "../assets/Logo";
import Screen from "../component/Screen";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../authentication/Firebase";
import CarButton from "../component/CarButton";

export default function LoginScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerErrorMessage, setRegisterErrorMessage] = useState("");
  const [registerSuccessMessage, setRegisterSuccessMessage] = useState("");

  const handleRegister = () => {
    if (name.trim() === "") {
      setRegisterErrorMessage("Please enter your name");
      setTimeout(() => {
        setRegisterErrorMessage("");
      }, 3000);
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        updateProfile(user, { displayName: name })
          .then(() => {
            console.log("Registered with:", user.email);
            setRegisterSuccessMessage("Successfully registered");
            setName("");
            setEmail("");
            setPassword("");

            setTimeout(() => {
              setRegisterErrorMessage("");
            }, 3000);

            setTimeout(() => {
              setRegisterSuccessMessage("");
            }, 3000);
          })
          .catch((error) => {
            console.log(error);
            setRegisterErrorMessage(error.message);
            setTimeout(() => {
              setRegisterErrorMessage("");
            }, 3000);
          });
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          setRegisterErrorMessage("User already exists.");
        } else if (
          error.code === "auth/invalid-email" ||
          "auth/missing-password"
        ) {
          setRegisterErrorMessage("Please fill all the fields");
        } else {
          setRegisterErrorMessage(error.message);
        }
        console.log(error);
        setTimeout(() => {
          setRegisterErrorMessage("");
        }, 3000);
      });
  };

  return (
    <Screen style={styles.container} behavior="height">
      <View style={styles.logoContainer}>
        <Logo />
        <Text style={styles.title}>Register</Text>
      </View>
      <View style={styles.textContainer}>
        <TextInput
          style={[styles.input, { fontSize: 18 }]}
          placeholderTextColor="white"
          placeholder="Name"
          onChangeText={(text) => setName(text)}
          value={name}
          keyboardType="email-address"
          autoCapitalization="none"
          autoCorrect={false}
        />
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
        {registerErrorMessage ? (
          <Text style={styles.errorText}>{registerErrorMessage}</Text>
        ) : null}
        {registerSuccessMessage ? (
          <Text style={styles.successText}>{registerSuccessMessage}</Text>
        ) : null}
        <CarButton title="Register" onPress={handleRegister} />
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
    paddingHorizontal: 20,
    width: "100%",
  },
  errorText: {
    color: colors.primary,
    marginBottom: 10,
    fontSize: 24,
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 15,
    width: "100%",
    borderRadius: 25,
    color: colors.white,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  successText: {
    color: "green",
    marginBottom: 10,
    fontSize: 24,
  },
  textContainer: {
    flex: 2,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  title: {
    textTransform: "uppercase",
    fontSize: 24,
    fontWeight: "800",
    color: colors.white,
  },
});
