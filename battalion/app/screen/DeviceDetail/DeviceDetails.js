import React, { useState } from "react";
import colors from "../../config/Colors/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

import {
  StyleSheet,
  Text,
  TextInput,
  View,
  StatusBar,
  Image,
  ImageBackground,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useAppSettingContext } from "../../context/AppSettingContext";
const DeviceDetails = ({ navigation }) => {
  const {
    isLocked,
    setDeviceIsLocked,
    isLightsOn,
    setDeviceIsLightsOn,
    getTempValueAndUnit,
    temp,
    boxTemp,
  } = useAppSettingContext();

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <ImageBackground
        style={styles.background}
        source={require("../../assets/background.png")}
      >
        <View style={styles.headingContainer}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TouchableWithoutFeedback onPress={() => navigation.goBack(null)}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color="#B0B0B0"
              />
            </TouchableWithoutFeedback>
            <Text style={styles.texHeading}>device details</Text>
          </View>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate("devicesetting")}
          >
            <AntDesign name="setting" size={30} color="#fff" />
          </TouchableWithoutFeedback>
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
            source={require("../../assets/devicedetail.png")}
          />

          <View style={{ display: "flex", gap: 25 }}>
            <View style={styles.deviceLocked}>
              <Text style={styles.lockedTxt}>
                {isLocked ? "Device Locked" : "Device Unlocked"}
              </Text>
              <View
                style={[
                  styles.switchOnOff,
                  isLocked ? styles.flexEnd : styles.flexStart,
                ]}
              >
                <View style={styles.iconBackgroundContainer}>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      setDeviceIsLocked(!isLocked);
                    }}
                  >
                    {isLocked ? (
                      <MaterialCommunityIcons
                        name="lock"
                        size={20}
                        color="#B0B0B0"
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="lock-open"
                        size={20}
                        color="black"
                      />
                    )}
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>

            <View style={styles.brightness}>
              <Text style={styles.brightnessTxt}>Light Auto</Text>
              <View
                style={[
                  styles.switchOnOff,
                  isLightsOn ? styles.flexEnd : styles.flexStart,
                ]}
              >
                <View style={styles.iconBackgroundContainer}>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      setDeviceIsLightsOn(!isLightsOn);
                    }}
                  >
                    {isLightsOn ? (
                      <MaterialCommunityIcons
                        name="brightness-5"
                        size={20}
                        color="#B0B0B0"
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="brightness-5"
                        size={20}
                        color="black"
                      />
                    )}
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.unlockedTempContainer}>
          <View style={styles.TempConatinerBg}>
            <Text style={styles.degree}>
              {getTempValueAndUnit({ value: boxTemp, unit: temp.unit })}
            </Text>
            <Text style={styles.actualTxt}>Actual box temperature</Text>
          </View>
          <TouchableOpacity
            style={styles.TempConatinerBg}
            onPress={() => {
              navigation.navigate("halfcircle");
            }}
          >
            <Text style={styles.degree}>{getTempValueAndUnit(temp)}</Text>
            <TouchableWithoutFeedback>
              <View style={styles.setTextContainer}>
                <Text style={styles.setText}>Set the box Temperature</Text>
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={20}
                  color="white"
                />
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </View>
        <View style={styles.percentagetxtContainer}>
          <View style={styles.percentageText}>
            <Text style={styles.BatteryPercentagetextOne}>33%</Text>

            <Text style={styles.BatteryPercentagetextTwo}>
              Plug your Device
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name="battery-outline"
              color={colors.white}
              size={20}
            />
            <MaterialCommunityIcons
              name="loading"
              size={20}
              color={colors.primary}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default DeviceDetails;

const styles = StyleSheet.create({
  actualTxt: {
    maxWidth: 124,
    fontWeight: "500",
    fontSize: 15,
    color: colors.white,
  },
  addDevice: {
    backgroundColor: colors.primary,
    color: colors.white,
    borderRadius: 20,
    alignItems: "center",
    padding: 5,
    fontSize: 14,
    fontWeight: "500",
  },

  battalionId: {
    paddingHorizontal: 15,
    alignSelf: "center",
    backgroundColor: "#000000a8",
    width: "100%",
  },
  brightness: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
  },
  brightnessTxt: {
    fontWeight: "500",
    fontSize: 14,
    color: "#B0B0B0",
    paddingLeft: 2,
  },

  container: {
    flex: 1,
  },
  connectedDevice: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.white,
  },
  degree: {
    fontWeight: "800",
    fontSize: 36,
    color: colors.white,
  },
  deviceLocked: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
  },
  deviceContainer: {
    backgroundColor: "#000000a8",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 20,
    alignItems: "center",
    width: "100%",
  },
  errorMessage: {
    color: "red",
    marginTop: 10,
  },
  flexEnd: {
    justifyContent: "flex-end",
    backgroundColor: colors.primary,
  },
  flexStart: {
    justifyContent: "flex-start",
    backgroundColor: "#424242",
  },
  headingContainer: {
    paddingHorizontal: 15,
    width: "100%",
    marginTop: 55,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  icon: {
    position: "absolute",
    right: 50,
    top: "50%",
    transform: [{ translateY: -15 }],
  },
  iconBackgroundContainer: {
    width: 34,
    height: 34,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  input: {
    width: 311,
    height: 40,
    marginVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#1B1B1B",
  },

  lockedTxt: {
    fontWeight: "500",
    fontSize: 14,
    color: "#B0B0B0",
    paddingRight: 5,
  },
  percentageText: {
    flexDirection: "column",
  },
  productImage: {
    width: 87,
    height: 74,
    opacity: 0.5,
  },
  percentagetxtContainer: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#2626266E",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  setText: {
    maxWidth: 124,
    fontWeight: "500",
    fontSize: 15,
    color: colors.white,
  },
  setTextContainer: {
    backgroundColor: colors.primary,
    padding: 5,
    borderRadius: 5,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  successMessage: {
    color: "green",
    marginTop: 10,
  },
  switchOnOff: {
    width: 60,
    height: 24,
    borderRadius: 18,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  TempConatinerBg: {
    width: 150,
    height: 159,
    backgroundColor: "#131313",
    borderRadius: 5,
    padding: 10,
    justifyContent: "space-between",
  },
  texHeading: {
    fontSize: 32,
    fontWeight: "800",
    textTransform: "uppercase",
    color: colors.white,
    fontWeight: "900",
    marginLeft: 10,
    alignItems: "flex-start",
  },
  BatteryPercentagetextOne: {
    fontSize: 36,
    fontWeight: "800",
    color: colors.white,
  },
  BatteryPercentagetextTwo: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.white,
  },

  unlockedImageContainer: {
    backgroundColor: "#131313",
    paddingVertical: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
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
    paddingHorizontal: 15,
    height: "100%",
  },
});
