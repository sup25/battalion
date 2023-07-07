import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import colors from "../config/colors";
import CarButton from "../component/CarButton";

const VerifyPhoneManually = () => {
  return (
    <View style={styles.container}>
      <View style={styles.containerSmall}>
        <Text style={styles.txtFirst}>Insert Code Manually</Text>
        <Text style={styles.txtSecond}>Write in the field below</Text>
        <TextInput style={styles.txtInput} />
      </View>
      <View style={styles.btn}>
        <CarButton title="confirm" width={277} textColor={colors.white} />
      </View>
    </View>
  );
};

export default VerifyPhoneManually;

const styles = StyleSheet.create({
  btn: {
    flex: 2,
    paddingHorizontal: 20,
    justifyContent: "flex-end",
    marginBottom: 50,
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  containerSmall: {
    width: "100%",
    marginTop: 76,
  },
  txtInput: {
    width: 283,
    backgroundColor: "#1E1E1E",
    color: colors.white,
    borderRadius: 5,
    height: 55,
    alignSelf: "center",
    marginTop: 31,
    padding: 10,
  },
  txtFirst: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 500,
    textAlign: "center",
  },
  txtSecond: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 400,
    textAlign: "center",
    marginTop: 8,
  },
});
