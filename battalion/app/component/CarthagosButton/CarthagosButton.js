import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import colors from "../../config/Colors/colors";

function CarthagosButton({
  title,
  onPress,
  color = "primary",
  width,
  textColor,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = () => {
    setIsLoading(true);
    onPress();

    // Simulating a loading delay, you can replace this with your asynchronous code
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: isLoading ? colors.medium : colors[color], width },
      ]}
      onPress={handlePress}
      disabled={isLoading} // Disable the button while loading
    >
      {isLoading ? (
        <ActivityIndicator color={colors.primary} /> // Show the loading indicator
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
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
    fontSize: 20,
    textTransform: "uppercase",
    fontWeight: "700",
  },
});

export default CarthagosButton;
