import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import colors from "../config/colors";

function CarButton({ title, onPress, color = "primary" }) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors[color] }]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: "100%",
    marginVertical: 5,
  },
  text: {
    color: colors.white,
    fontSize: 20,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});
export default CarButton;
