import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

import auth from "@react-native-firebase/auth";
import colors from "../../config/Colors/colors";
import CarthagosLinkButton from "../../component/CarthagosLinkButton/CarthagosLinkButton";
import { useRoute } from "@react-navigation/native";

import DismissMyKeyboard from "../../component/DismissMyKeyboard"

import { UseBioMetric } from "../../Hooks/UseBioMetric";
import TextLogoWhite from "../../assets/TextLogoWhite";
import { useToast } from "react-native-toast-notifications";
import { useAuth } from "../../utils/AuthProvider/AuthProvider";
import { FontsLoad } from "../../utils/FontsLoad";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toast = useToast();
  const route = useRoute();

  useEffect(() => {
    const { phoneNumber } = route.params || {};
    if (phoneNumber) {
      setEmail(phoneNumber);
    }
  }, [route]);
  useEffect(() => {
    FontsLoad();
  }, []);

  const handleLogin = async () => {
    try {
      const biometricResult = await UseBioMetric();

      if (biometricResult) {
        const res = await auth().signInWithEmailAndPassword(email, password);
        if (res?.user && !res?.user?.phoneNumber) {
          navigation.navigate("Phoneverify");
          return toast.show("User doesnt have a phone number attached.", {
            type: "normal",
          });
        }
        navigation.navigate("privateRoute", { screen: "MainTabs" });
      } else {
        const res = await auth().signInWithEmailAndPassword(email, password);
       
        if (res?.user && !res?.user?.phoneNumber) {
          navigation.navigate("Phoneverify");
          return toast.show("User doesnt have a phone number attached.", {
            type: "normal",
          });
        }
        navigation.navigate("privateRoute", { screen: "MainTabs" });
        toast.show("Biometric authentication failed", {
          type: "normal",
        });
        console.log("Biometric authentication failed");
      }
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        toast.show("User not found. Please check your email or password.", {
          type: "normal",
        });
      } else if (error.code === "auth/user-not-found") {
        toast.show("User does not exist.", {
          type: "normal",
        });
      } else {
        toast.show("Login failed. Please try again", {
          type: "normal",
        });
      }
      console.log(error);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPass");
  };

  return (
    <DismissMyKeyboard>
    <View style={styles.container}>
      <Text style={styles.watermarkText}></Text>
      <Image
        style={styles.productImage}
        source={require("../../assets/battalion-sign-in.png")}
      />
      <View style={styles.logoConatiner}>
        <TextLogoWhite />
        <Text style={styles.title}>Welcome Back</Text>
      </View>
      <View style={styles.inputTextContainer}>
        <TextInput
          style={[styles.input, { fontSize: 18, fontFamily: "SF-Pro-Display" }]}
          placeholder="Email"
          placeholderTextColor="white"
          onChangeText={(text) => setEmail(text)}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={[styles.input, { fontSize: 18, fontFamily: "SF-Pro-Display" }]}
          placeholderTextColor="white"
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
        />
        <TouchableOpacity
          style={{ alignSelf: "flex-start", paddingLeft: 20 ,alignSelf:'center',
          textAlign: 'center',}}
          onPress={handleForgotPassword}
        >
          <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.btnLink}>
        <CarthagosLinkButton
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
     </DismissMyKeyboard>
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
    justifyContent: "center",
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
    fontFamily: "SF-Pro-Display",
    
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
    bottom: 160,
  },
  productImage: {
    height: 310,
    width: 305,
    bottom: 150,
    alignSelf:"center"
  },
  inputTextContainer: {
    paddingHorizontal: 15,
    alignItems: "center",
    bottom: 150,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    fontFamily: "SF-Pro-Display",
    color: colors.white,
    marginTop: 9,
  },
  watermarkText: {
    textTransform: "uppercase",
    fontSize: 60,
    fontWeight: "900",
    color: colors.white,
    textAlign: "center",
    opacity: 0.5,
    height: 120,
    marginTop: 62,
    alignSelf: "center",
  },
});

export default LoginScreen;
