import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../config/colors";
import CarButton from "./CarButton";

function CarLinkButton({
  navigation,
  mainDesc,
  desc,
  title,
  onPress,
  width,
  registerRoute,
  loginRoute,
  color = "primary",
  textColor,
}) {
  const handleLinkPress = () => {
    if (registerRoute) {
      navigation.navigate("Register");
    } else if (loginRoute) {
      navigation.navigate("Login");
    } else if (onPress) {
      onPress();
    }
  };

  return (
    <View>
      <CarButton
        title={title}
        onPress={onPress}
        width={width}
        color={color}
        textColor={textColor}
      />
      <View style={styles.footerText}>
        <Text style={styles.footerNormalText}>
          {mainDesc}
          <Text onPress={handleLinkPress} style={styles.footerLinkText}>
            {desc}
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerText: {
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 15,
  },

  footerNormalText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "400",
  },
  footerLinkText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "400",
  },
});

export default CarLinkButton;
