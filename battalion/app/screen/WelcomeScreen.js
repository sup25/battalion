import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  StatusBar,
  Image,
  ImageBackground,
} from "react-native";

import { useAuth } from "../navigation/AuthNavigator";

import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const WelcomeScreen = ({ navigation }) => {
  const { currentUser } = useAuth();
  const userEmail = currentUser?.email;
  const userName = userEmail ? userEmail.split("@")[0] : "";

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <ImageBackground
        style={styles.background}
        source={require("../assets/background.png")}
      >
        <View style={{ paddingHorizontal: 20, width: "100%" }}>
          <Text style={styles.textEmail}>Welcome, {userName}</Text>
        </View>
        <View style={styles.deviceContainer}>
          <Text style={styles.connDevice}>Devices Connected</Text>
          <Text
            style={styles.addDevice}
            onPress={() => {
              navigation.navigate("verifyphonemanually");
            }}
          >
            Add Device +
          </Text>
        </View>
        <View style={styles.battalionId}>
          <TextInput
            style={styles.input}
            placeholder="Battalion Device #23456"
            placeholderTextColor="#656565"
          />
          <MaterialCommunityIcons
            name="pencil"
            color="#5A5A5A"
            size={30}
            style={styles.icon}
          />
        </View>
      </ImageBackground>
      <View style={styles.wrapper}>
        <View style={styles.unlockedImageContainer}>
          <Image
            style={styles.productImage}
            source={require("../assets/product.png")}
          />
          <View style={styles.lockedConatiner}>
            <View style={styles.iconEllipse}>
              <MaterialCommunityIcons name="lock" size={20} color="#B0B0B0" />
            </View>
            <Text style={styles.lockedTxt}>Device Locked</Text>
          </View>
        </View>
        <View style={styles.unlockedTempContainer}>
          <View style={styles.TempConatinerBg}>
            <Text style={styles.degree}>-- °F</Text>
            <Text style={styles.actualTxt}>Actual box temperature</Text>
          </View>
          <View style={styles.TempConatinerBg}>
            <Text style={styles.degree}>-- °F</Text>
            <View style={styles.setTextContainer}>
              <Text style={styles.setText}>
                Set the box Temperature
                <MaterialCommunityIcons name="arrow-right" size={20} />
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.perTxtContainer}>
          <View style={styles.percentageText}>
            <Text style={styles.textOne}>--%</Text>
            <Text style={styles.textTwo}>Plug your Device</Text>
          </View>
          <MaterialCommunityIcons
            name="loading"
            size={20}
            color={colors.primary}
          />
        </View>
      </View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  actualTxt: {
    maxWidth: 124,
    fontWeight: 500,
    fontSize: 15,
    color: "#5A5A5A",
  },
  addDevice: {
    backgroundColor: colors.primary,
    color: colors.white,
    borderRadius: 20,
    alignItems: "center",
    padding: 5,
    fontSize: 14,
    fontWeight: 500,
  },
  background: {},
  battalionId: {
    paddingHorizontal: 20,
    alignSelf: "center",
    backgroundColor: "#000000a8",
    width: "100%",
  },
  button: {
    backgroundColor: "blue",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
  },
  connDevice: {
    fontSize: 15,
    fontWeight: 500,
    color: colors.white,
  },
  degree: {
    fontWeight: 800,
    fontSize: 36,
    color: "#5A5A5A",
  },
  deviceContainer: {
    backgroundColor: "#000000a8",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: "center",
    width: "100%",
    marginTop: 21,
  },
  errorMessage: {
    color: "red",
    marginTop: 10,
  },

  input: {
    width: 311,
    height: 40,
    marginVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#1B1B1B",
  },
  icon: {
    position: "absolute",
    right: 50,
    top: "50%",
    transform: [{ translateY: -15 }],
  },
  iconEllipse: {
    width: 34,
    height: 34,
    backgroundColor: "#5A5A5A",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  lockedConatiner: {
    backgroundColor: "#1B1B1B",
    width: 125,
    height: 93,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  lockedTxt: {
    fontWeight: 500,
    fontSize: 14,
    color: "#B0B0B0",
  },
  percentageText: {
    flexDirection: "column",
  },
  productImage: {
    width: 87,
    height: 74,
    opacity: 0.5,
  },
  perTxtContainer: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#2626266E",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  setText: {
    maxWidth: 124,
    fontWeight: 500,
    fontSize: 15,
    color: colors.white,
  },
  setTextContainer: {
    backgroundColor: colors.primary,
    padding: 5,
    borderRadius: 5,
    opacity: 0.5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  successMessage: {
    color: "green",
    marginTop: 10,
  },
  TempConatinerBg: {
    width: 150,
    height: 159,
    backgroundColor: "#131313",
    borderRadius: 5,
    padding: 10,
    justifyContent: "space-between",
  },
  textEmail: {
    fontSize: 32,
    fontWeight: "800",
    textTransform: "uppercase",
    color: colors.white,
    fontWeight: 900,
    marginTop: 37,
    borderBottomColor: colors.white,
    borderBottomWidth: 1,
    paddingBottom: 10,
    width: "100%",
    alignItems: "flex-start",
  },
  textOne: {
    fontSize: 36,
    fontWeight: 800,
    color: "#5A5A5A",
  },
  textTwo: {
    fontSize: 16,
    fontWeight: 800,
    color: "#5A5A5A",
  },

  unlockedImageContainer: {
    backgroundColor: "#131313",
    paddingVertical: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  unlockedTempContainer: {
    paddingVertical: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  wrapper: {
    backgroundColor: colors.black,
    paddingHorizontal: 20,
    height: "100%",
  },
});
