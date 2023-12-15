import { StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "../config/Colors/colors";
/* import Slider from "@react-native-community/slider"; */

export default function SetTemperatureScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.tempratureIndicationtxt}>72 °F</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        thumbTintColor={colors.primary}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.medium}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  slider: {
    width: 295,
    height: 40,
    /*   transform: [{ scaleY: 1 }], */
  },
  tempratureIndicationtxt: {
    fontSize: 51,
    fontWeight: "900",
    lineHeight: 63,
    textAlign: "left",
    color: colors.white,
  },
});
