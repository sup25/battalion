import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppSettingContext } from "../../context/AppSettingProvider";
import colors from "../../config/Colors";
import ChargingProgressCircle from "../ChargingProgressCircle";
import { useBleContext } from "../../context/BLEProvider";
import { FontsLoad } from "../../utils/FontsLoad";

const BatteryPercent = () => {
  const { connectedDevice } = useBleContext();
  const { boxBatteryLevel, boxIsCharging } = useAppSettingContext();
  useEffect(() => {
    FontsLoad();
  }, []);

  const getIconBasedOnBatteryLevel = () => {
    if (!boxBatteryLevel) return "battery-10-bluetooth";
    if (boxBatteryLevel > 0 && boxBatteryLevel <= 5 && !boxIsCharging)
      return "battery-alert-variant-outline";
    if (boxBatteryLevel > 0 && boxBatteryLevel <= 10)
      return "battery-10-bluetooth";
    if (boxBatteryLevel > 10 && boxBatteryLevel <= 20)
      return "battery-20-bluetooth";
    if (boxBatteryLevel > 20 && boxBatteryLevel <= 30)
      return "battery-30-bluetooth";
    if (boxBatteryLevel > 30 && boxBatteryLevel <= 40)
      return "battery-40-bluetooth";
    if (boxBatteryLevel > 40 && boxBatteryLevel <= 50)
      return "battery-50-bluetooth";
    if (boxBatteryLevel > 50 && boxBatteryLevel <= 60)
      return "battery-60-bluetooth";
    if (boxBatteryLevel > 60 && boxBatteryLevel <= 70)
      return "battery-70-bluetooth";
    if (boxBatteryLevel > 70 && boxBatteryLevel <= 80)
      return "battery-80-bluetooth";
    if (boxBatteryLevel > 80 && boxBatteryLevel <= 90)
      return "battery-90-bluetooth";
    if (boxBatteryLevel > 90) return "battery-bluetooth";
  };

  return (
    <View style={styles.perTxtContainer}>
      <View style={styles.percentageText}>
        <Text
          style={{
            color: connectedDevice?.device ? "white" : "grey",
            fontSize: 16,
            fontFamily: "SF-Pro-Display",
          }}
        >
          Device battery
        </Text>
        <Text
          style={[
            styles.textOne,
            { color: connectedDevice?.device ? "white" : "grey" },
          ]}
        >
          {boxBatteryLevel < 0 ? "--" : boxBatteryLevel}%
        </Text>
        <Text
          style={[
            styles.textTwo,
            { color: connectedDevice?.device ? "white" : "grey" },
          ]}
        >
          {boxIsCharging
            ? "Charging"
            : boxBatteryLevel < 20 && connectedDevice?.device
            ? "Plug Your Device"
            : ""}
        </Text>
      </View>
      <View style={styles.BatteryTxtPercent}>
        <MaterialCommunityIcons
          name={getIconBasedOnBatteryLevel()}
          size={32}
          color={colors.icon}
        />
        <ChargingProgressCircle percents={boxBatteryLevel} />
      </View>
    </View>
  );
};

export default BatteryPercent;

const styles = StyleSheet.create({
  perTxtContainer: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#2626266E",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 15,
    paddingVertical: 20,
  },

  percentageText: {
    flexDirection: "column",
  },
  textOne: {
    fontSize: 36,
    fontWeight: "800",
    color: "#5A5A5A",
  },
  textTwo: {
    fontSize: 16,
    color: "#5A5A5A",
    fontFamily: "Alternate-Gothic",
    textTransform: "uppercase",
  },
  BatteryTxtPercent: {
    flexDirection: "row",
    gap: 11,
    alignItems: "center",
  },
});
