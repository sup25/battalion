import { Platform } from "react-native";
import colors from "../Colors/colors";

const TextStyle = (fontSize, fontWeight, color, isHeading) => ({
  fontSize,
  fontFamily: isHeading
    ? Platform.OS === "android"
      ? "Alternate Gothic ATF"
      : "Avenir"
    : Platform.OS === "android"
    ? "SF Pro Display"
    : "Avenir",
  color,
  fontWeight,
});

export default {
  colors,
  headingTxt: TextStyle(32, "900"),
  bodyText: TextStyle(16, "500"),
};
