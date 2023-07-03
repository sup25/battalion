import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ImageBackground,
} from "react-native";

import React, { useEffect } from "react";
import colors from "../config/colors";
import Logo from "../assets/Logo";
import CarButton from "../component/CarButton";

export default function MainScreen({ navigation }) {
  return (
    <ImageBackground
      blurRadius={1}
      style={styles.background}
      source={require("../assets/background.png")}
    >
      <StatusBar style="auto" />
      <View style={styles.logoConatiner}>
        <Logo />
        <Text style={styles.text}>BATTALION</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <CarButton title="Login" onPress={() => navigation.navigate("Login")} />
        <CarButton
          title="Register"
          color="secondary"
          onPress={() => navigation.navigate("Register")}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  buttonsContainer: {
    padding: 20,
    width: "100%",
  },
  logoConatiner: {
    top: 70,
    position: "absolute",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
  },
  text: {
    fontSize: 48,
    textTransform: "uppercase",
    fontWeight: "800",
    color: colors.white,
  },
});
