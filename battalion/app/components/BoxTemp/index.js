import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppSettingContext } from "../../context/AppSettingProvider";
import colors from "../../config/Colors";
import { useBleContext } from "../../context/BLEProvider";
import { FontsLoad } from "../../utils/FontsLoad";

const BoxTemp = () => {
  const { getTempValueAndUnit, temp, boxTemp } = useAppSettingContext();
  const { connectedDevice } = useBleContext();
  useEffect(() => {
    FontsLoad();
  }, []);
  return (
    <View>
      <View style={styles.TempConatinerBg}>
        <View style={styles.TemptextIconWrapper}>
          <Text
            style={[
              styles.degree,
              { color: connectedDevice?.device ? "white" : "grey" },
            ]}
          >
            {boxTemp < 0
              ? "--"
              : getTempValueAndUnit({ value: boxTemp, unit: temp.unit }, false)}
          </Text>
          <MaterialCommunityIcons
            name="thermometer"
            size={32}
            color={colors.icon}
          />
        </View>

        <Text
          style={[
            styles.actualTxt,
            { color: connectedDevice?.device ? "white" : "grey" },
          ]}
        >
          Actual box temperature
        </Text>
      </View>
    </View>
  );
};

export default BoxTemp;

const styles = StyleSheet.create({
  TempConatinerBg: {
    width: 150,
    height: 159,
    backgroundColor: "#131313",
    borderRadius: 5,
    padding: 10,
    justifyContent: "space-between",
  },
  TemptextIconWrapper: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  degree: {
    fontWeight: "800",
    fontSize: 36,
    color: "#5A5A5A",
  },
  actualTxt: {
    maxWidth: 124,
    fontWeight: "500",
    fontSize: 15,
    color: "#5A5A5A",
    fontFamily: "SF-Pro-Display",
  },
});
