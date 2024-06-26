import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { LinearGradient, Stop, Rect } from "react-native-svg";

const GradientBackground = ({
  color1 = "transparent",
  color2 = "#000000",
  style = {},
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Gradient Background */}
      <Svg style={StyleSheet.absoluteFill}>
        <LinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="40%">
          <Stop offset="0%" stopColor={color1} stopOpacity={0} />
          <Stop offset="100%" stopColor={color2} />
        </LinearGradient>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#gradient)" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    left: 0,
    position: "absolute",
    zIndex: 0,
    width: "100%",
    height: "100%",

    // Other styles for your container
  },
});

export default GradientBackground;
