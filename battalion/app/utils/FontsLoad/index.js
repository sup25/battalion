import * as Font from "expo-font";

export async function FontsLoad() {
  await Font.loadAsync({
    "Alternate-Gothic": require("../../assets/fonts/AlternateGothic.ttf"),
    "AlternateGothicblack": require("../../assets/fonts/AlternateGothicblack.otf"),
    "Alternate-Gothic-Bold": require("../../assets/fonts/AlternateGothicATF-Black.otf"),
    "SF-Pro-Display": require("../../assets/fonts/SF-Pro-Display.otf"),
  });
}
