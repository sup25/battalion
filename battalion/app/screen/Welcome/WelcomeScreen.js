import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  StatusBar,
  Image,
  ImageBackground,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { useToast } from "react-native-toast-notifications";

import { useAuth } from "../../utils/AuthProvider";
import FetchUserProfile from "../../Hooks/UserProfile";
import colors from "../../config/Colors/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppSettingContext } from "../../context/AppSettingContext";
import ChargingProgressCircle from "../../component/ChargingProgressCircle";
import { useBleContext } from "../../utils/BLEProvider";

const WelcomeScreen = ({ navigation }) => {
  const toast = useToast();
  const { currentUser } = useAuth();

  const [userName, setUserName] = useState();
  const {
    isLocked,
    getTempValueAndUnit,
    temp,
    boxTemp,
    boxBatteryLevel,
    boxIsCharging,
    isLightsOn,
    setDeviceIsLightsOn,
    setDeviceIsLocked,
  } = useAppSettingContext();
  const { writeLightsToDevice, writeLockToDevice, connectedDevice } =
    useBleContext();

  const userData = FetchUserProfile(currentUser);

  useEffect(() => {
    // Set the user's display name from currentUser
    if (userData) {
      setUserName(userData?.name || "");
    }
  }, [userData]);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <ImageBackground
        style={styles.background}
        source={require("../../assets/background.png")}
      >
        <View
          style={{
            paddingHorizontal: 15,
            width: "100%",
            marginTop: 55,
            borderBottomColor: colors.white,
            borderBottomWidth: 1,
            paddingBottom: 10,
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <Text style={styles.textEmail}>Welcome, {userName}</Text>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate("devicesetting")}
          >
            <AntDesign name="setting" size={30} color="#fff" />
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.deviceContainer}>
          <Text style={styles.connDevice}>Devices Connected</Text>
          <Text
            style={styles.addDevice}
            onPress={() => {
              navigation.navigate("searchscreen");
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
            source={require("../../assets/devicedetail.png")}
          />

          <View style={{ display: "flex", gap: 25 }}>
            <View style={styles.deviceLocked}>
              <Text
                style={[
                  styles.lockedTxt,
                  { color: connectedDevice.device ? "white" : "grey" },
                ]}
              >
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
                    onPress={async () => {
                      if (connectedDevice.device) {
                        try {
                          await writeLockToDevice([
                            !isLocked === false ? 0 : 1,
                          ]);
                          setDeviceIsLocked(!isLocked);
                        } catch (err) {
                          toast.show(
                            "Error writing to device, try to reconnect",
                            {
                              type: "normal",
                            }
                          );
                        }
                      } else {
                        toast.show("Please connect to a device.", {
                          type: "normal",
                        });
                      }
                    }}
                  >
                    {isLocked ? (
                      <MaterialCommunityIcons
                        name="lock"
                        size={20}
                        color={connectedDevice.device ? "black" : "#B0B0B0"}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="lock-open"
                        size={20}
                        color={connectedDevice.device ? "black" : "#B0B0B0"}
                      />
                    )}
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>

            <View style={styles.brightness}>
              <Text
                style={[
                  styles.brightnessTxt,
                  { color: connectedDevice.device ? "white" : "grey" },
                ]}
              >
                Light Auto
              </Text>
              <View
                style={[
                  styles.switchOnOff,
                  isLightsOn ? styles.flexEnd : styles.flexStart,
                ]}
              >
                <View style={styles.iconBackgroundContainer}>
                  <TouchableWithoutFeedback
                    onPress={async () => {
                      if (connectedDevice.device) {
                        try {
                          await writeLightsToDevice([
                            !isLightsOn === false ? 0 : 1,
                          ]);
                          setDeviceIsLightsOn(!isLightsOn);
                        } catch (err) {
                          toast.show(
                            "Error writing to device, try to reconnect.",
                            {
                              type: "normal",
                            }
                          );
                        }
                      } else {
                        toast.show("Please connect to a device.", {
                          type: "normal",
                        });
                      }
                    }}
                  >
                    {isLightsOn ? (
                      <MaterialCommunityIcons
                        name="brightness-5"
                        size={20}
                        color={connectedDevice.device ? "black" : "#B0B0B0"}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="brightness-5"
                        size={20}
                        color={connectedDevice.device ? "black" : "#B0B0B0"}
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
            <Text
              style={[
                styles.degree,
                { color: connectedDevice.device ? "white" : "grey" },
              ]}
            >
              {boxTemp < 0
                ? "--"
                : getTempValueAndUnit({ value: boxTemp, unit: temp.unit })}
            </Text>
            <Text
              style={[
                styles.actualTxt,
                { color: connectedDevice.device ? "white" : "grey" },
              ]}
            >
              Actual box temperature
            </Text>
          </View>
          <TouchableOpacity
            style={styles.TempConatinerBg}
            onPress={() => {
              if (connectedDevice.device) {
                navigation.navigate("halfcircle");
              } else {
                toast.show("Please connect to a device.", {
                  type: "normal",
                });
              }
            }}
          >
            <Text
              style={[
                styles.degree,
                { color: connectedDevice.device ? "white" : "grey" },
              ]}
            >
              {getTempValueAndUnit(temp)}
            </Text>
            <View style={styles.setTextContainer}>
              <Text
                style={[
                  styles.setText,
                  { color: connectedDevice.device ? "white" : "grey" },
                ]}
              >
                Set the box Temperature
              </Text>
              <MaterialCommunityIcons
                name="arrow-right"
                size={20}
                color="white"
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.perTxtContainer}>
          <View style={styles.percentageText}>
            <Text
              style={[
                styles.textOne,
                { color: connectedDevice.device ? "white" : "grey" },
              ]}
            >
              {boxBatteryLevel < 0 ? "--" : boxBatteryLevel}%
            </Text>
            <Text
              style={[
                styles.textTwo,
                { color: connectedDevice.device ? "white" : "grey" },
              ]}
            >
              {boxIsCharging ? "Charging" : "Plug your Device"}
            </Text>
          </View>
          <ChargingProgressCircle percents={boxBatteryLevel} />
        </View>
      </View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  unlockedImageContainer: {
    backgroundColor: "#131313",
    paddingVertical: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  productImage: {
    width: 87,
    height: 74,
    opacity: 0.5,
  },
  deviceLocked: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
  },
  lockedTxt: {
    fontWeight: "500",
    fontSize: 14,
    color: "#B0B0B0",
    paddingRight: 5,
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
  flexEnd: {
    justifyContent: "flex-end",
    backgroundColor: colors.primary,
  },
  flexStart: {
    justifyContent: "flex-start",
    backgroundColor: "#424242",
  },
  iconBackgroundContainer: {
    width: 34,
    height: 34,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
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
  actualTxt: {
    maxWidth: 124,
    fontWeight: "500",
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
    fontWeight: "500",
  },

  battalionId: {
    paddingHorizontal: 15,
    alignSelf: "center",
    backgroundColor: "#000000a8",
    width: "100%",
  },
  button: {
    backgroundColor: "blue",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
  },
  container: {
    flex: 1,
  },
  connDevice: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.white,
  },
  degree: {
    fontWeight: "800",
    fontSize: 36,
    color: "#5A5A5A",
  },
  deviceContainer: {
    backgroundColor: "#000000a8",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 15,
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
    fontWeight: "500",
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
    alignItems: "flex-start",
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
    fontSize: 28,
    fontWeight: "800",
    textTransform: "uppercase",
    color: colors.white,
    fontWeight: "900",

    alignItems: "flex-start",
  },
  textOne: {
    fontSize: 36,
    fontWeight: "800",
    color: "#5A5A5A",
  },
  textTwo: {
    fontSize: 16,
    fontWeight: "800",
    color: "#5A5A5A",
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
