import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import colors from "../../config/Colors";
import { FontsLoad } from "../../utils/FontsLoad";

function CarthagosButton({
  title,
  onPress,
  color = "primary",
  width,
  textColor,
  style = false,
  textStyle = false,
}) {
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    FontsLoad();
  }, []);

  return (
    <TouchableOpacity
      style={
        style
          ? style
          : [
              styles.button,
              {
                backgroundColor: isLoading ? colors.medium : colors[color],
                width,
              },
            ]
      }
      onPress={() => (isLoading ? false : onPress(setIsLoading))}
      disabled={isLoading} // Disable the button while loading
    >
      {isLoading ? (
        <ActivityIndicator color={colors.primary} /> // Show the loading indicator
      ) : (
        <Text
          style={textStyle ? textStyle : [styles.text, { color: textColor }]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: 277,
    marginVertical: 5,
    height: 60,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 20,
    textTransform: "uppercase",
    fontWeight: "800",
    fontFamily: "Alternate-Gothic-bold",
    textAlign: "center",
  },
});

export default CarthagosButton;
