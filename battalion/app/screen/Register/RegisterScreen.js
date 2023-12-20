import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, StatusBar } from "react-native";
import colors from "../../config/Colors/colors";
import TextLogo from "../../assets/TextLogo";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/Firebase/Firebase";
import CarthagosLinkButton from "../../component/CarthagosLinkButton/CarthagosLinkButton";
import { useAuth } from "../../utils/AuthProvider/AuthProvider";
import handleClearMessage from "../../utils/HandleClearMessage/HandleClearMessage";
import { addUserToFirestore } from "../../config/UsersCollection/UsersCollection";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [registerErrorMessage, setRegisterErrorMessage] = useState("");
  const [registerSuccessMessage, setRegisterSuccessMessage] = useState("");

  const { currentUser } = useAuth();

  const handleRegister = async (setIsLoading) => {
    setIsLoading(true);
    if (name.trim() === "" || email.trim() === "" || password.trim() === "") {
      setRegisterErrorMessage("Please fill all the fields");
      handleClearMessage(setRegisterErrorMessage, 3000);
      return;
    }

    if (password !== confirmpassword) {
      setIsLoading(false);
      handleClearMessage(setPasswordMatchError, 3000);
      return;
    } else {
      setPasswordMatchError(false);
    }

    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredentials.user;
      console.log("User name for updateProfile:", name);

      const userData = {
        name,
        email,
      };

      const addedToFirestore = await addUserToFirestore(user.uid, userData);

      if (addedToFirestore) {
        console.log("User data added to Firestore successfully.");
      } else {
        setIsLoading(false);
        console.error("Failed to add user data to Firestore.");
      }

      setRegisterSuccessMessage("Successfully registered");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      handleClearMessage(setRegisterSuccessMessage, 3000);

      // If the phone is verified, navigate to another screen
      if (currentUser && currentUser.phoneNumber) {
      } else {
        // Navigate to the "Phoneverify" screen if phone is not verified
        navigation.navigate("Phoneverify");
      }
    } catch (error) {
      setIsLoading(false);
      if (error.code === "auth/email-already-in-use") {
        setRegisterErrorMessage("User already exists.");
      } else if (
        error.code === "auth/invalid-email" ||
        error.code === "auth/missing-password"
      ) {
        setRegisterErrorMessage("Please fill all the fields");
      } else {
        setRegisterErrorMessage(error.message);
      }

      handleClearMessage(setRegisterErrorMessage, 3000);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <TextLogo />
        <Text style={styles.title}>Create your Account</Text>
      </View>
      <View style={styles.inputTextContainer}>
        <TextInput
          style={styles.input}
          placeholderTextColor="#656565"
          placeholder="Name"
          onChangeText={(text) => setName(text)}
          value={name}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#656565"
          onChangeText={(text) => setEmail(text)}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#656565"
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#656565"
          placeholder="Confirm Password"
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmpassword}
          secureTextEntry
        />
        {registerErrorMessage ? (
          <Text style={styles.errorText}>{registerErrorMessage}</Text>
        ) : null}
        {registerSuccessMessage ? (
          <Text style={styles.successText}>{registerSuccessMessage}</Text>
        ) : null}
        {passwordMatchError ? (
          <Text style={styles.errorText}>Password doesnot match</Text>
        ) : null}
      </View>
      <View style={styles.btnLink}>
        <CarthagosLinkButton
          navigation={navigation}
          onPress={(setIsLoading) => handleRegister(setIsLoading)}
          title="Continue"
          mainDesc="Already Have an account? "
          desc="Login"
          width={277}
          loginRoute="Login"
          textColor="white"
        />
      </View>
      <StatusBar translucent backgroundColor="transparent" />
    </View>
  );
}

const styles = StyleSheet.create({
  btnLink: {
    alignItems: "center",
    marginTop: 139,
  },
  container: {
    backgroundColor: colors.black,
    flex: 1,
    paddingHorizontal: 15,
  },
  errorText: {
    color: colors.primary,
    marginBottom: 10,
    fontSize: 14,
  },

  input: {
    height: 50,
    borderColor: colors.secondary,
    borderWidth: 1,
    marginBottom: 10,
    padding: 15,
    width: 283,
    /* width: "100%", */
    borderRadius: 5,
    color: colors.white,
    fontSize: 18,
  },
  inputTextContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 36,
  },
  logoContainer: {
    marginTop: 66,
    justifyContent: "center",
    alignItems: "center",
  },
  successText: {
    color: "green",
    marginBottom: 10,
    fontSize: 14,
  },

  title: {
    fontSize: 24,
    fontWeight: "500",
    color: colors.white,
    marginTop: 18,
  },
});
