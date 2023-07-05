import { StyleSheet } from "react-native";
import React from "react";
import TextLogo from "../assets/TextLogo";
import colors from "../config/colors";
import Screen from "../component/Screen";

export default function Occupation() {
  return (
    <Screen style={styles.container}>
      <TextLogo />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
});
