import React from "react";
import { View, ActivityIndicator } from "react-native";

const Spinner = ({ color = "black", size = "small" }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Spinner;
