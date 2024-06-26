import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import colors from "../../config/Colors";
import { useAppSettingContext } from "../../context/AppSettingProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ChargingProgressCircle from "../ChargingProgressCircle";
import { useBleContext } from "../../context/BLEProvider";
import { useToast } from "react-native-toast-notifications";
import { getUsersDevices } from "../../utils/getUsersDevices";

const DeviceList = ({ ownerId, navigation }) => {
  const {
    getTempValueAndUnit,
    temp,
    boxBatteryLevel,
    isLocked,
    boxLocked,
    devicesIds,
    setDevicePassword,
  } = useAppSettingContext();

  const { connectToDevice, connectedDevice, requestPermissions } =
    useBleContext();
  const [devices, setDevices] = useState([]);
  const [isLoaded, setIsLoaded] = useState(true);
  const [connecting, setConnecting] = useState({ device: null, status: false });
  const toast = useToast();

  useEffect(() => {
    getUsersDevices(
      ownerId,
      connectedDevice,
      setDevices,
      setIsLoaded,
      isLocked,
      temp,
      boxBatteryLevel,
      Platform.OS
    );
    setConnecting({ device: null, status: false });
    requestPermissions();
  }, []);

  const tryToConnectToDevice = async (item) => {
    try {
      setDevicePassword(item.fourDigitCode);
      await connectToDevice(
        { id: item.deviceId[0] },
        item.combinedSerialNum,
        item.fourDigitCode
      );
      return navigation.navigate("mainDeviceDetails");
    } catch (err) {
      setDevicePassword([]);
      console.log("connecting to the device err:", err);
      setConnecting({ device: null, status: false });
      toast.show(
        "Failed to connect to the device, please check your bluetooth connection and try again."
      );
    }
  };

  const connectToDeviceHandler = async (item, user) => {
    //if the user is not approved by the owner - show a message
    if (!user?.approved && item?.owner?.id !== ownerId) {
      return toast.show("Device not approved by the owner");
    }
    // if device is already connected - just redirect
    if (item.deviceId === connectedDevice?.device?.id) {
      return navigation.navigate("mainDeviceDetails");
    }

    //connecting to the device
    if (!connecting.status) {
      setConnecting({ device: item.deviceId, status: true });
      try {
        if (devicesIds[item.combinedSerialNum]) {
          item.deviceId = devicesIds[item.combinedSerialNum];
        }
        // for ios, looping through the devices' ids (if only one connect to it) and connecting to the right one.
        if (item?.deviceId?.length && typeof item?.deviceId !== "string") {
          if (item?.deviceId?.length === 1) {
            await tryToConnectToDevice(item);
          } else if (item?.deviceId?.length > 1) {
            for (let i = 0; i < item.deviceId.length; i++) {
              await tryToConnectToDevice(item);
            }
          }
        } else {
          await tryToConnectToDevice(item);
        }
      } catch (err) {
        console.log("connecting to the device err:", err);
        setConnecting({ device: null, status: false });
        toast.show(
          "Failed to connect to the device, please check your bluetooth connection and try again."
        );
      }
    }
  };

  return (
    <View style={styles.Container}>
      {isLoaded && (
        <View>
          <Text style={{ color: "white" }}>Fetching devices</Text>
          <ActivityIndicator size="small" color="#ffffff" />
        </View>
      )}
      <ScrollView style={{ width: "100%" }}>
        {devices.map((item, index) => {
          const user = item.users.find((user) => user.id === ownerId);
          return (
            <TouchableOpacity
              onPress={() => connectToDeviceHandler(item, user)}
              style={[
                styles.DeviceInfoWrapper,
                {
                  marginTop: index > 0 ? 15 : 0,
                  position: "relative",
                  opacity:
                    item.deviceId === connectedDevice?.device?.id ? 1 : 0.7,
                },
              ]}
              key={item.id}
            >
              <View style={styles.Section}>
                <View style={styles.IconTxtWrapper}>
                  <Image
                    source={require("../../assets/product.png")}
                    style={{ width: 30, height: 25 }}
                  />
                  <View style={styles.DeviceInformation}>
                    <Text style={{ color: colors.white, overflow: "hidden" }}>
                      {item.name}{" "}
                    </Text>
                    {user?.status === "pending" && (
                      <View
                        style={{
                          backgroundColor: "#D8D017",
                          paddingHorizontal: 7,
                          paddingVertical: 3,
                          borderRadius: 50,
                          fontSize: 12,
                        }}
                      >
                        <Text style={{ fontSize: 14 }}>
                          Pending Approval{" "}
                          <MaterialCommunityIcons
                            name="lock"
                            size={14}
                            color="#000000"
                          />
                        </Text>
                      </View>
                    )}
                  </View>

                  {connecting.device === item.deviceId &&
                    connectedDevice.connecting && (
                      <ActivityIndicator size="small" color="#ffffff" />
                    )}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",

                    width: "100%",
                    paddingTop: 14,
                    paddingBottom: 14,
                  }}
                >
                  <View
                    style={[
                      styles.Wrapper,
                      { opacity: item.isEnabled ? 1 : 0.5 },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="thermometer-bluetooth"
                      size={32}
                      color={colors.icon}
                    />
                    <Text style={styles.Degree}>
                      {item.temp
                        ? getTempValueAndUnit(
                            {
                              value: item.temp.value,
                              unit: item.temp.unit,
                            },
                            true
                          )
                        : `--${temp.unit === "c" ? "℃" : "°F"}`}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.Wrapper,
                      { opacity: item.isEnabled ? 1 : 0.5 },
                    ]}
                  >
                    <ChargingProgressCircle
                      percents={item?.batteryLevel ? item.batteryLevel : 0}
                      circleRadius={10}
                      strokeWidth={3}
                    />
                    <Text style={styles.BatteryAndPercents}>
                      {item?.batteryLevel ? item.batteryLevel : "--"}%
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.Wrapper,
                      { opacity: item.isEnabled ? 1 : 0.5 },
                    ]}
                  >
                    <Text
                      style={{
                        ...styles.lockedTxt,
                        fontSize:
                          item.deviceId === connectedDevice?.device?.id
                            ? 12
                            : 22,
                      }}
                    >
                      {item?.deviceId === connectedDevice?.device?.id
                        ? `Device \n${item?.isLocked ? "Locked" : "Unlocked"}`
                        : "--"}
                    </Text>
                    <View style={styles.IconWrapper}>
                      {item?.isLocked ? (
                        <MaterialCommunityIcons
                          name="lock"
                          size={20}
                          color="#B0B0B0"
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name="lock-open"
                          size={20}
                          color="white"
                        />
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default DeviceList;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    paddingBottom: 100,
    width: "100%",
  },
  DeviceInfoWrapper: {
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 5,
    width: "100%",
  },
  Section: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 121,
    backgroundColor: "#131313",
    padding: 14,
    borderRadius: 5,
  },
  IconTxtWrapper: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
  },
  DeviceInformation: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.white,

    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
  },
  Wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "32%",
    height: 55,
    backgroundColor: "#1b1b1b",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 5,
  },
  Degree: {
    fontWeight: "900",
    fontSize: 28,
    color: colors.white,
  },
  BatteryAndPercents: {
    fontWeight: "900",
    fontSize: 22,
    marginLeft: 5,
    color: colors.white,
  },
  lockedTxt: {
    color: colors.white,

    fontWeight: "bold",
  },
  IconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#282828",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
  },
  disabledDevice: {
    backgroundColor: "#777",
  },
});
