import React, { useEffect, useState } from "react";
import CarthagosButton from "../../component/CarthagosButton/CarthagosButton";
import { StyleSheet, View, TextInput, Text } from "react-native";
import auth from "@react-native-firebase/auth";
import colors from "../../config/Colors/colors";
import TextLogo from "../../assets/TextLogo";
import { useAuth } from "../../utils/AuthProvider/AuthProvider";
import { useToast } from "react-native-toast-notifications";
import { FontsLoad } from "../../utils/FontsLoad";

const ForgotPasswordPrivate = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [email, setEmail] = useState("");
  const toast = useToast();
  const [errormsg, setErrorMsg] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  useEffect(() => {
    FontsLoad();
  }, []);

  const handleResetPassword = async (setIsLoading) => {
    setIsLoading(true);
    if (currentUser && currentUser.email && currentUser.email === email) {
      try {
        console.log("Sending reset email to:", email);
        await auth().sendPasswordResetEmail(email);
        toast.show("sent successfully", {
          type: "normal",
        });

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.show("cant send reset email", {
          type: "normal",
        });
      }
    } else {
      setIsLoading(false);
      toast.show("Invalid email or user not logged in", {
        type: "normal",
      });
    }
  };

  return (
    <DismissMyKeyboard>
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
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            color="white"
          />
        </View>
        <View style={styles.btnContainer}>
          <CarthagosButton
            onPress={(setIsLoading) => handleResetPassword(setIsLoading)}
            title="Submit"
            width={277}
            textColor="white"
          />
        </View>
      </View>
    </DismissMyKeyboard>
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
    paddingHorizontal: 15,
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
    color: colors.white,
    fontFamily: "SF-Pro-Display",
    fontWeight: "400",
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
    fontFamily: "SF-Pro-Display",
  },
});
