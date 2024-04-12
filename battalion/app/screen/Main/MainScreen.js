import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ImageBackground,
} from "react-native";

import colors from "../../config/Colors/colors";
import CarthagosButton from "../../component/CarthagosButton/CarthagosButton";
import GradientBackground from "../../component/GradientBackground";

export default function MainScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      <ImageBackground
        style={styles.background}
        source={require("../../assets/Battalion-home-screen.png")}
      >
        <View style={styles.headingTextContainer}>
          <Text style={styles.headingText}>make hard work easier</Text>
        </View>

        <View style={styles.textContainer}>
          <GradientBackground color1={"transparent"} color2={"#000000"} />
          <Text style={styles.textWelcome}>WELCOME TO BATTALION</Text>
          <Text style={styles.textParagraph}>
            We are specialists in developing resilient tools and accessories
            suitable for all-around construction needs.
          </Text>
        </View>
        <View style={styles.buttonsContainer}>
          <CarthagosButton
            title="new member"
            color="white"
            width={168}
            onPress={() => navigation.navigate("Register")}
            textColor="black"
          />
          <CarthagosButton
            textColor="white"
            title="sign in"
            onPress={() => navigation.navigate("Login")}
            width={145}
          />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  container: {
    flex: 1,
  },

  headingTextContainer: {
    position: "absolute",
    top: 200,
  },
  headingText: {
    textTransform: "uppercase",
    fontWeight: "900",
    color: colors.white,
    alignItems: "center",
    fontSize: 55,
    lineHeight: 55,
    width: "100%",
    maxWidth: 360,
  },
  textAndButton: {
    backgroundColor: colors.black,
    paddingBottom: 50,
  },
  textContainer: {
    display: "flex",
    position: "relative",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  textParagraph: {
    fontWeight: "400",
    fontSize: 16,
    color: "#8F8F8F",
    width: 300,
    textAlign: "center",
  },
  textWelcome: {
    fontWeight: "400",
    fontSize: 20,
    color: colors.white,
  },
  buttonsContainer: {
    padding: 20,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.black,
    paddingBottom: 80,
  },
});
