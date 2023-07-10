import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ImageBackground,
} from "react-native";

import colors from "../config/colors";
import CarButton from "../component/CarButton";

export default function MainScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      <ImageBackground
        style={styles.background}
        source={require("../assets/background.png")}
      >
        <View style={styles.headingTextContainer}>
          <Text style={styles.headingText}>make hard work easier</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.textWelcome}>WELCOME TO BATTALION</Text>
          <Text style={styles.textParagraph}>
            We are specialists in developing resilient tools and accessories
            suitable for all-around construction needs.
          </Text>
        </View>
        <View style={styles.buttonsContainer}>
          <CarButton
            title="new member"
            color="white"
            width={168}
            onPress={() => navigation.navigate("Register")}
            textColor="black"
          />
          <CarButton
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
    top: 160,
  },
  headingText: {
    maxWidth: 300,
    textTransform: "uppercase",
    fontWeight: "900",
    color: colors.white,
    alignItems: "center",
    fontSize: 60,
  },
  textAndButton: {
    backgroundColor: colors.black,
    paddingBottom: 50,
  },
  textContainer: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000a8",
  },
  textParagraph: {
    fontWeight: "400",
    fontSize: 16,
    color: "#8F8F8F",
    maxWidth: 300,
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
