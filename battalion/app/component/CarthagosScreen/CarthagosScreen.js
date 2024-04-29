import React from "react";
import Constants from "expo-constants";
import { SafeAreaView, StyleSheet, View } from "react-native";
import DismissMyKeyboard from "../DismissMyKeyboard";
function CarthagosScreen({ children, style }) {
  return (
    <View style={[styles.screen, style]}>
      <DismissMyKeyboard>{children}</DismissMyKeyboard>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
  },
});
export default CarthagosScreen;
