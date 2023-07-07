import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import colors from "../config/colors";
import CarButton from "../component/CarButton";

const InserCode = () => {
  return (
    <View style={styles.container}>
      <View style={styles.containerSmall}>
        <Text style={styles.txtFirst}>Insert Code</Text>
        <Text style={styles.txtSecond}>
          Enter the security code we sent to 00 0000 0000
        </Text>
        <View style={styles.txtInputContainer}>
          <TextInput style={styles.txtInput} />
          <TextInput style={styles.txtInput} />
          <TextInput style={styles.txtInput} />
          <TextInput style={styles.txtInput} />
          <TextInput style={styles.txtInput} />
        </View>
        <CarButton
          title="resend code"
          width={277}
          textColor={colors.black}
          color="white"
        />
      </View>
      <View style={styles.btn}>
        <CarButton title="confirm" width={277} textColor={colors.white} />
      </View>
    </View>
  );
};

export default InserCode;

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
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 27,
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
    maxWidth: 200,
  },
});
