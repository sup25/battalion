import React from "react";
import { View, StyleSheet, Text, TouchableWithoutFeedback } from "react-native";
import { useAppSettingContext } from "../../context/AppSettingContext/AppSettingContext";
import colors from "../../config/Colors/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useBleContext } from "../../utils/BLEProvider/BLEProvider";
import { useToast } from "react-native-toast-notifications";

const LocksToggle = () => {
  const toast = useToast();
  const { isLocked, setDeviceIsLocked } = useAppSettingContext();
  const { writeLockToDevice, connectedDevice } = useBleContext();
  return (
    <View style={styles.deviceLocked}>
      <Text
        style={[
          styles.lockedTxt,
          { color: connectedDevice?.device ? "white" : "grey" },
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
              if (connectedDevice?.device) {
                try {
                  await writeLockToDevice([!isLocked === false ? 0 : 1]);
                  setDeviceIsLocked(!isLocked);
                } catch (err) {
                  toast.show("Error writing to device, try to reconnect", {
                    type: "normal",
                  });
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
                color={connectedDevice?.device ? "black" : "#B0B0B0"}
              />
            ) : (
              <MaterialCommunityIcons
                name="lock-open"
                size={20}
                color={connectedDevice?.device ? "black" : "#B0B0B0"}
              />
            )}
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  );
};
export default LocksToggle;

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
