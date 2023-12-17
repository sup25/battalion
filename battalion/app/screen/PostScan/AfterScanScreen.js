import { StyleSheet, Text, Image, TouchableOpacity, View } from "react-native";
import React from "react";
import colors from "../../config/Colors/colors";

import CarthagosButton from "../../component/CarthagosButton";

const AfterScanScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.containerSmall}>
        <Text style={styles.txtFirst}>Scan your device</Text>
        <Text style={styles.txtSecond}>
          We’ll send you a code to keep your account secure
        </Text>
        <View style={styles.deviceInfo}>
          <Text style={styles.batTxt}>Battalion Device Name</Text>
          <Text style={styles.barcodeTxt}>345234652XXFRW</Text>
          <Image source={require("../../assets/barcode.png")} />
        </View>
      </View>
      <View style={styles.btn}>
        <CarthagosButton title="confirm" textColor="white" width={277} />
      </View>
    </View>
  );
};

export default AfterScanScreen;

const styles = StyleSheet.create({
  barcodeTxt: {
    fontSize: 16,
    fontWeight: "500",
    color: "#868686",
    marginBottom: 8,
  },
  batTxt: {
    fontSize: 25,
    fontWeight: "500",
    color: colors.white,
    marginBottom: 20,
  },

  btn: {
    paddingHorizontal: 15,
    marginTop: 200,
    alignItems: "center",
    width: "100%",
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
  deviceInfo: {
    width: 315,
    height: 178,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E1E1E",
    marginTop: 47,
    borderRadius: 5,
  },
  txtInputContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  txtFirst: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "500",
    textAlign: "center",
    maxWidth: 181,
    alignItems: "center",
  },
  txtSecond: {
    color: "#8F8F8F",
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 8,
    maxWidth: 170,
  },
  txtThird: {
    color: "#8F8F8F",
    fontSize: 16,
    fontWeight: "400",
    alignSelf: "center",
    marginTop: 8,
    maxWidth: 170,
  },
});
