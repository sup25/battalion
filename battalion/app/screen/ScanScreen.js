import { StyleSheet, Text, Image, ImageBackground, View } from "react-native";
import React from "react";
import colors from "../config/colors";
import TextLogo from "../assets/TextLogo";

const ScanScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.Text}>
        <Text style={styles.txtFirst}>Searching for devices</Text>
      </View>
      <View style={styles.circle}>
        <View style={styles.logo}>
          <TextLogo />
        </View>
      </View>
    </View>
  );
};

export default ScanScreen;

const styles = StyleSheet.create({
  circle: {
    width: 210,
    height: 210,
    display: "flex",
    alignSelf: "center",
    backgroundColor: colors.medium,
    borderRadius: 999,
    top: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },

  Text: {
    width: "100%",
    marginTop: 76,
    alignItems: "center",
  },

  txtFirst: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 500,
    textAlign: "center",
    maxWidth: 181,
    alignItems: "center",
  },
});
