import React, { useState } from "react";
import { StyleSheet, Text, ImageBackground, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CarthagosButton from "../component/CarthagosButton";
import colors from "../config/colors";

const ConnectionScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/Groupcircle.png")}
        style={styles.background}
      >
        <Text style={styles.txtFirst}>Connection Approved </Text>
        <View style={styles.Iconbackground}>
          <MaterialCommunityIcons name="check-circle" color="white" size={60} />
        </View>
        <View style={styles.btn}>
          <CarthagosButton title="continue" textColor="white" width={277} />
        </View>
      </ImageBackground>
    </View>
  );
};

export default ConnectionScreen;

const styles = StyleSheet.create({
  background: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  btn: {
    paddingHorizontal: 20,
    marginTop: 254,
    alignItems: "center",
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  Iconbackground: {
    width: 104,
    height: 104,
    backgroundColor: "white",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  txtFirst: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "500",
    textAlign: "center",
    width: "100%",
    marginTop: 63,
    marginBottom: 39,
  },
});
