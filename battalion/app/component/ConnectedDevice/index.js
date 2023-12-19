import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import colors from "../../config/Colors/colors";
import { useAppSettingContext } from "../../context/AppSettingContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ChargingProgressCircle from "../ChargingProgressCircle";

const ConnectedDevice = () => {
  const { getTempValueAndUnit, temp, boxBatteryLevel, isLocked } =
    useAppSettingContext();
  return (
    <View style={styles.Container}>
      <View style={styles.DeviceInfoWrapper}>
        <View style={styles.IconTxtWrapper}>
          <Image
            source={require("../../assets/product.png")}
            style={{ width: 30, height: 25 }}
          />
          <Text style={styles.DeviceInformation}>Battalion Device #23584</Text>
        </View>
        <View style={styles.Section}>
          <View style={styles.Wrapper}>
            <MaterialCommunityIcons
              name="thermometer"
              size={32}
              color={colors.icon}
            />
            <Text style={styles.Degree}>{getTempValueAndUnit(temp)}</Text>
          </View>
          <View style={styles.Wrapper}>
            <Text style={styles.BatteryAndPercents}>
              {boxBatteryLevel < 0 ? "--" : boxBatteryLevel}%
            </Text>
            <ChargingProgressCircle percents={boxBatteryLevel} />
          </View>
          <View style={styles.Wrapper}>
            <Text style={styles.lockedTxt}>
              {isLocked ? "Device Locked" : "Device Unlocked"}
            </Text>
            <View style={styles.IconWrapper}>
              {isLocked ? (
                <MaterialCommunityIcons name="lock" size={20} color="#B0B0B0" />
              ) : (
                <MaterialCommunityIcons
                  name="lock-open"
                  size={20}
                  color="black"
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ConnectedDevice;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  DeviceInfoWrapper: {
    flexDirection: "column",
    width: 335,
    height: 121,
    backgroundColor: colors.soft,
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 5,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  Section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 335,
    backgroundColor: "#131313",
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
});
