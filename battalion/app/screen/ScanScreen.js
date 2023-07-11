import { StyleSheet, Text, Image, TouchableOpacity, View } from "react-native";
import React from "react";
import colors from "../config/colors";

import VerifyPhoneManually from "./VerifyPhoneManually";
const ScanScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.containerSmall}>
        <Text style={styles.txtFirst}>Scan your device</Text>
        <Text style={styles.txtSecond}>
          We’ll send you a code to keep your account secure
        </Text>
        <View style={{ marginVertical: 47 }}>
          <Image source={require("../assets/scanner.png")} />
        </View>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("VerifyPhoneManually")}
      >
        <Text style={styles.txtThird}>Manually add the code</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ScanScreen;

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 20,
    marginTop: 300,
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  containerSmall: {
    width: "100%",
    marginTop: 76,
    alignItems: "center",
  },
  txtInputContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  txtFirst: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 500,
    textAlign: "center",
    maxWidth: 181,
    alignItems: "center",
  },
  txtSecond: {
    color: "#8F8F8F",
    fontSize: 16,
    fontWeight: 400,
    textAlign: "center",
    marginTop: 8,
    maxWidth: 170,
  },
  txtThird: {
    color: "#8F8F8F",
    fontSize: 16,
    fontWeight: 400,

    alignSelf: "center",
    marginTop: 8,
    maxWidth: 170,
  },
});
