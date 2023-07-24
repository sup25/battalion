import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { auth } from "../authentication/Firebase";
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useAuth } from "../navigation/AuthNavigator";
import colors from "../config/colors";
import CarLinkButton from "../component/CarLinkButton";
import TextLogo from "../assets/TextLogo";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const { currentUser } = useAuth();

  const handleLogin = async () => {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("Logged in with:", userCredentials.user.email);

      if (currentUser && currentUser.phoneNumber) {
        // If the phone is verified, update the user's profile with the email (if not already set)
        const currentEmail = currentUser?.email || "";
        if (currentEmail !== email) {
          await updateProfile(auth.currentUser, { email: email });
        }
        console.log("Email and phone number match. Logging in.");
      } else {
        // Navigate to the "Phoneverify" screen if phone is not verified
        navigation.navigate("Phoneverify");
        console.log(
          "Phonenumber is not verified. Redirecting to phone verify."
        );
      }
    } catch (error) {
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
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPass");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.watermarkText}>Battalion</Text>
      <Image
        style={styles.productImage}
        source={require("../assets/product.png")}
      />
      <View style={styles.logoConatiner}>
        <TextLogo />
        <Text style={styles.title}>Welcome Back</Text>
      </View>
      <View style={styles.inputTextContainer}>
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
        <TouchableOpacity
          style={{ alignSelf: "flex-start", paddingLeft: 20 }}
          onPress={handleForgotPassword}
        >
          <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
        </TouchableOpacity>
        {loginErrorMessage ? (
          <Text style={styles.errorText}>{loginErrorMessage}</Text>
        ) : null}
      </View>
      <View style={styles.btnLink}>
        <CarLinkButton
          navigation={navigation}
          onPress={handleLogin}
          title="Sign in"
          mainDesc="Don't have an account? "
          desc="Create new"
          width={277}
          registerRoute="Register"
          textColor="white"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  btnLink: {
    alignItems: "center",
    bottom: 150,
  },
  container: {
    backgroundColor: colors.black,
    flex: 1,
    justifyContent: "flex-start",
  },
  errorText: {
    color: colors.primary,
    marginBottom: 10,
    fontSize: 14,
  },
  forgotPasswordText: {
    color: "#727272",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 4,
    marginBottom: 4,
  },
  input: {
    height: 50,
    borderColor: colors.secondary,
    borderWidth: 1,
    marginBottom: 10,
    padding: 15,
    width: 283,
    borderRadius: 5,
    color: colors.white,
  },
  logoConatiner: {
    alignItems: "center",
    bottom: 170,
  },
  productImage: {
    height: 360,
    width: 355,
    bottom: 100,
  },
  inputTextContainer: {
    paddingHorizontal: 20,
    alignItems: "center",
    bottom: 150,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    color: colors.white,
    marginTop: 9,
  },
  watermarkText: {
    textTransform: "uppercase",
    fontSize: 80,
    fontWeight: "900",
    color: colors.white,
    textAlign: "center",
    opacity: 0.5,
    width: "100%",
    marginTop: 62,
  },
});

export default LoginScreen;
