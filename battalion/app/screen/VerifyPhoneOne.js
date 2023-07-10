import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import colors from "../config/colors";
import CarButton from "../component/CarButton";

const VerifyPhoneOne = () => {
  return (
    <View style={styles.container}>
      <View style={styles.containerSmall}>
        <Text style={styles.txtFirst}>Verify your phone with a code</Text>
        <Text style={styles.txtSecond}>
          We’ll send you a code to keep your account secure
        </Text>
        <View style={styles.txtInputContainer}>
          <TextInput style={styles.txtInputPhoneNumber} defaultValue="+1" />
          <TextInput style={styles.txtInput} />
        </View>
      </View>
      <View style={styles.btn}>
        <CarButton title="confirm" width={277} textColor={colors.white} />
      </View>
    </View>
  );
};

export default VerifyPhoneOne;

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
  txtInput: {
    width: 250,
    backgroundColor: "#1E1E1E",
    color: colors.white,
    borderRadius: 5,
    height: 55,
    alignSelf: "center",
    marginTop: 31,
    padding: 10,
    marginLeft: 10,
    fontSize: 24,
  },
  txtInputPhoneNumber: {
    width: 50,
    backgroundColor: "#1E1E1E",
    color: colors.white,
    borderRadius: 5,
    height: 55,
    alignSelf: "center",
    marginTop: 31,
    padding: 10,
    fontSize: 24,
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
});
