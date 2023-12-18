import { StyleSheet, Text, View, TextInput } from "react-native";
import React from "react";
import CarthagosLinkButton from "../../component/CarthagosLinkButton";
import Screen from "../component/Screen";
import colors from "../../config/Colors/colors";
import TextLogo from "../../assets/TextLogo";

const Occupation = ({ navigation }) => {
  const Category = [
    { id: 1, occupation: "Electrician" },
    { id: 2, occupation: "Construction Manager" },
    { id: 3, occupation: "Plumber" },
    { id: 4, occupation: "Carpenter" },
    { id: 5, occupation: "Worker" },
    { id: 6, occupation: "Civil Engineer" },
    { id: 7, occupation: "Architect" },
    { id: 8, occupation: "Operator" },
    { id: 9, occupation: "Bricklayer" },
    { id: 10, occupation: "Technician" },
    { id: 11, occupation: "Roofer" },
    { id: 12, occupation: "Engineer" },
    { id: 13, occupation: "Pipefitter" },
    { id: 14, occupation: "Foreman" },
    { id: 15, occupation: "Heavy equipment operator" },
  ];

  return (
    <>
      <Screen style={styles.container}>
        <View style={styles.logoTextContainer}>
          <TextLogo />
          <Text style={styles.textHeading}>What's your Occupation?</Text>
        </View>
        <View style={styles.categoryContainer}>
          {Category.map((cat) => {
            return (
              <View key={cat.id} style={styles.categoryItem}>
                <Text style={styles.category}>{cat.occupation}</Text>
              </View>
            );
          })}
        </View>
        <View style={styles.occupationContainer}>
          <Text style={styles.otherText}>Other</Text>
          <TextInput
            style={styles.input}
            placeholder="Write here"
            placeholderTextColor="#989898"
          />
        </View>
        <View style={styles.btnLink}>
          <CarthagosLinkButton
            navigation={navigation}
            title="Continue"
            mainDesc="Already Have an account? "
            desc="Login"
            width={277}
            loginRoute="Login"
            textColor="white"
          />
        </View>
      </Screen>
    </>
  );
};

export default Occupation;

const styles = StyleSheet.create({
  btnLink: {
    alignItems: "center",
  },
  category: {
    color: colors.white,
    backgroundColor: "#2D2D2D",
    height: 47,
    width: "100%",
    padding: 10,
    borderRadius: 20,
    fontSize: 18,
    fontWeight: "400",
    display: "flex",
    alignItems: "center",
  },
  categoryContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingLeft: 18,
    paddingRight: 20,
    marginTop: 46,
  },
  categoryItem: {
    marginRight: 8,
    marginTop: 8,
  },
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },

  input: {
    height: 37,
    borderRadius: 20,
    width: 273,
    paddingLeft: 15,
    backgroundColor: colors.white,
    fontSize: 18,
    right: 260,
  },
  logoTextContainer: {
    width: "100%",
    alignItems: "center",
  },
  occupationContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 34,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  otherText: {
    backgroundColor: "#2D2D2D",
    color: colors.white,
    height: 37,
    borderRadius: 20,
    alignItems: "center",

    fontSize: 18,
    fontWeight: "400",
    paddingLeft: 15,
    width: "100%",
  },

  textHeading: {
    color: colors.white,
    marginTop: 18,
    fontSize: 24,
    fontWeight: "500",
  },
  txtBtnContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: 76,
  },
});
