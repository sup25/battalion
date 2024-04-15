import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import CarthagosButton from "../CarthagosButton/CarthagosButton";

const ImageAndButton = () => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      <Image
        style={{ marginBottom: 37 }}
        source={require("../../assets/PRODUCTS.png")}
      />
      <CarthagosButton title="Connect Device" textColor="white" width={267} />
    </View>
  );
};

export default ImageAndButton;

const styles = StyleSheet.create({});
