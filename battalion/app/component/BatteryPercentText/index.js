import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppSettingContext } from "../../context/AppSettingContext";
import colors from "../../config/Colors/colors";
import ChargingProgressCircle from "../ChargingProgressCircle";

const BatteryPercentText = () => {
  const { boxBatteryLevel, boxIsCharging } = useAppSettingContext();
  return (
    <View style={styles.perTxtContainer}>
      <View style={styles.percentageText}>
        <Text style={styles.textOne}>
          {boxBatteryLevel < 0 ? "--" : boxBatteryLevel}%
        </Text>
        <Text style={styles.textTwo}>
          {boxIsCharging ? "Charging" : "Plug your Device"}
        </Text>
      </View>
      <View style={styles.BatteryTxtPercent}>
        <MaterialCommunityIcons
          name="battery-outline"
          size={32}
          color={colors.icon}
        />
        <ChargingProgressCircle percents={boxBatteryLevel} />
      </View>
    </View>
  );
};

export default BatteryPercentText;

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
    fontWeight: "800",
    color: "#5A5A5A",
  },
  BatteryTxtPercent: {
    flexDirection: "row",
    gap: 11,
    alignItems: "center",
  },
});
