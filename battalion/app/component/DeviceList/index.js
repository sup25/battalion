import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import colors from "../../config/Colors/colors";
import { useAppSettingContext } from "../../context/AppSettingContext/AppSettingContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ChargingProgressCircle from "../ChargingProgressCircle";

const DeviceList = () => {
  const { getTempValueAndUnit, temp, boxBatteryLevel } = useAppSettingContext();

  const deviceData = [
    {
      name: "Device 1",
      temp: 72,
      unit: "°F",
      batteryLevel: 54,
      isLocked: false,
      id: "1",
      isMain: true,
      isEnabled: true,
    },
    {
      name: "Device 2",
      temp: 74,
      unit: "°F",
      batteryLevel: 91,
      isLocked: false,
      id: "2",
      isMain: false,
      isEnabled: true,
    },
    {
      name: "Device 3",
      temp: "--",
      unit: null,
      batteryLevel: null,
      isLocked: true,
      id: null,
      isMain: null,
      isEnabled: false,
    },
  ];

  return (
    <View style={styles.Container}>
      {deviceData.map((item) => (
        <View key={item.id} style={styles.DeviceInfoWrapper}>
          <View style={styles.Section}>
            <View style={styles.IconTxtWrapper}>
              <Image
                source={require("../../assets/product.png")}
                style={{ width: 30, height: 25 }}
              />
              <Text style={styles.DeviceInformation}>{item.name}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 5,
                width: 335,
                padding: 14,
              }}
            >
              <View
                style={[styles.Wrapper, { opacity: item.isEnabled ? 1 : 0.5 }]}
              >
                <MaterialCommunityIcons
                  name="thermometer"
                  size={32}
                  color={colors.icon}
                />
                <Text style={styles.Degree}>
                  {item.temp}
                  {item.unit}
                </Text>
              </View>
              <View
                style={[styles.Wrapper, { opacity: item.isEnabled ? 1 : 0.5 }]}
              >
                <Text style={styles.BatteryAndPercents}>
                  {item.batteryLevel}
                </Text>
                <ChargingProgressCircle percents={boxBatteryLevel} />
              </View>
              <View
                style={[styles.Wrapper, { opacity: item.isEnabled ? 1 : 0.5 }]}
              >
                <Text style={styles.lockedTxt}>
                  {item.isLocked ? "Locked" : "Unlocked"}
                </Text>
                <View style={styles.IconWrapper}>
                  {item.isLocked ? (
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
        </View>
      ))}
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
  },
  DeviceInfoWrapper: {
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 5,
  },
  Section: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: 335,
    height: 121,
    backgroundColor: "#131313",
    padding: 14,
    borderRadius: 5,
  },
  IconTxtWrapper: {
    flexDirection: "row",
    alignSelf: "flex-start",
  },
  DeviceInformation: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.white,
    paddingRight: 14,
  },
  Wrapper: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    width: 93,
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
    fontSize: 28,
    color: colors.white,
  },
  lockedTxt: {
    width: 48,
    color: colors.white,
  },
  IconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#282828",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledDevice: {
    backgroundColor: "#777",
  },
});
