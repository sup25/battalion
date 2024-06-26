import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../../config/Colors";
import CarthagosButton from "../CarthagosButton";
import { FontsLoad } from "../../utils/FontsLoad";

function CarthagosLinkButton({
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
  isLoading = false,
}) {
  useEffect(() => {
    FontsLoad();
  }, []);
  const handleLinkPress = () => {
    if (isLoading) return;
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
      <CarthagosButton
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
    fontFamily: "SF-Pro-Display",
  },
  footerLinkText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "SF-Pro-Display",
  },
});

export default CarthagosLinkButton;
