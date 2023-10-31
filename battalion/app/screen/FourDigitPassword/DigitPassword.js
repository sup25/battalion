import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import colors from "../../config/colors";
import CarthagosButton from "../../component/CarthagosButton";

const DigitPassword = () => {
  return (
    <View style={styles.container}>
      <View style={styles.containerSmall}>
        <Text style={styles.txtFirst}>4 digit password</Text>
        <Text style={styles.txtSecond}>
          Input the password to unlock the box in the digital display, you can
          change this password later in the settings.
        </Text>
        <View style={styles.txtInputContainer}>
          <TextInput style={styles.txtInput} />
          <TextInput style={styles.txtInput} />
          <TextInput style={styles.txtInput} />
          <TextInput style={styles.txtInput} />
        </View>
      </View>
      <View style={styles.btn}>
        <CarthagosButton title="confirm" width={277} textColor={colors.white} />
      </View>
    </View>
  );
};

export default DigitPassword;

const styles = StyleSheet.create({
  btn: {
    marginTop: 277,
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  containerSmall: {
    marginTop: 76,
    alignItems: "center",
  },
  txtInput: {
    width: 50,
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
  txtInputContainer: {
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 33,
    alignSelf: "center",
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
    maxWidth: 250,
  },
});
