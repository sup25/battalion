import { StyleSheet, Text, View } from "react-native";
import React from "react";
import CarButton from "../component/CarButton";
import Screen from "../component/Screen";
import colors from "../config/colors";
import TextLogo from "../assets/TextLogo";
import { TextInput } from "react-native";
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
        <Text style={styles.otherText}>
          Other
          <TextInput
            style={styles.input}
            placeholder="Write here"
            placeholderTextColor="#989898"
          />
        </Text>
      </View>
      <View style={styles.txtBtnContainer}>
        <CarButton title="Continue" />
        <View style={styles.footerText}>
          <Text style={styles.footerNormalText}>
            Already have an account?{" "}
            <Text
              onPress={() => navigation.navigate("Login")}
              style={styles.footerLinkText}
            >
              Login
            </Text>
          </Text>
        </View>
      </View>
    </Screen>
  );
};

export default Occupation;

const styles = StyleSheet.create({
  category: {
    color: colors.white,
    backgroundColor: "#2D2D2D",
    height: 37,
    width: "100%",
    padding: 10,
    borderRadius: 20,
    fontSize: 20,
    fontWeight: "400",
    display: "flex",
    alignItems: "center",
  },
  categoryContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingLeft: 20,
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
  footerText: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  footerNormalText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 400,
  },
  footerLinkText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 400,
  },
  input: {
    width: "100%",
    height: 37,
    borderRadius: 20,
    marginLeft: 8,
    paddingLeft: 15,
    backgroundColor: colors.white,
    fontSize: 20,
  },
  logoTextContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 66,
  },
  occupationContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 54,
    paddingLeft: 20,
    paddingRight: 20,
  },
  otherText: {
    display: "flex",
    backgroundColor: "#2D2D2D",
    color: colors.white,
    height: 37,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    fontSize: 20,
    fontWeight: "400",
    paddingLeft: 15,
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
