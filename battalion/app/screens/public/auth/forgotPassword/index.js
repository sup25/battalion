import React, { useEffect, useState } from "react";
import CarthagosButton from "../../../../components/CarthagosButton";
import { StyleSheet, View, TextInput, Text } from "react-native";
import auth from "@react-native-firebase/auth";
import colors from "../../../../config/Colors";
import TextLogo from "../../../../assets/TextLogo";
import CarthagosScreen from "../../../../components/CarthagosScreen/CarthagosScreen";
import CarthagosLinkButton from "../../../../components/CarthagosLinkButton/CarthagosLinkButton";
import { FontsLoad } from "../../../../utils/FontsLoad";

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [errormsg, setErrorMsg] = useState("");
  useEffect(() => {
    FontsLoad();
  }, []);
  const handleResetPassword = () => {
    auth()
      .sendPasswordResetEmail(email)
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

  return (
    <CarthagosScreen style={styles.container} behavior="height">
      <View style={styles.container}>
        {emailSent ? (
          <>
            <View style={{ alignItems: "center", marginTop: 200 }}>
              <Text style={styles.emailSentText}>
                Password reset email has been sent.
              </Text>
              <CarthagosButton
                title=" Back To home"
                onPress={() => navigation.navigate("Login")}
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
              {errormsg ? (
                <Text style={styles.errorText}>{errormsg}</Text>
              ) : null}
            </View>
            <View style={styles.btnContainer}>
              <CarthagosLinkButton
                navigation={navigation}
                onPress={handleResetPassword}
                title="Submit"
                mainDesc="Already have an account? "
                desc="Login"
                width={277}
                loginRoute="Login"
                textColor="white"
              />
            </View>
          </>
        )}
      </View>
    </CarthagosScreen>
  );
};

export default ForgotPassword;

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
    color: "#656565",
    fontFamily: "SF-Pro-Display",
    fontWeight: "400",
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
    fontWeight: "500",
    color: colors.white,
    marginTop: 18,
    fontFamily: "SF-Pro-Display",
  },
});
