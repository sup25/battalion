import { Platform } from "react-native";
import colors from "./Colors/colors";
export default {
  colors,
  text: {
    fontSize: 16,
    fontFamily: Platform.OS === "android" ? "SF Pro Display" : "Avenir",
    color: colors.white,
  },
};
