import React from "react";
import { View, StyleSheet, Text, TouchableWithoutFeedback } from "react-native";
import { useAppSettingContext } from "../../context/AppSettingContext";
import colors from "../../config/Colors/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const DeviceLockedUnlocked = () => {
  const { isLocked, setDeviceIsLocked } = useAppSettingContext();

  return (
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
              <MaterialCommunityIcons name="lock" size={20} color="#B0B0B0" />
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
  );
};
export default DeviceLockedUnlocked;

const styles = StyleSheet.create({
  deviceLocked: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 11,
    alignItems: "center",
  },
  lockedTxt: {
    fontWeight: "500",
    fontSize: 14,
    color: "#B0B0B0",
    paddingRight: 11,
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
});
