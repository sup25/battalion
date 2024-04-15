import * as Font from "expo-font";

export async function FontsLoad() {
  await Font.loadAsync({
    "Alternate-Gothic": require("../../assets/fonts/AlternateGothic.ttf"),
    "SF-Pro-Display": require("../../assets/fonts/SF-Pro-Display.otf"),
  });
}
