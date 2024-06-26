import React, { useEffect } from "react";
import { View, StyleSheet, Text, TouchableWithoutFeedback } from "react-native";
import { useAppSettingContext } from "../../context/AppSettingProvider";
import colors from "../../config/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useToast } from "react-native-toast-notifications";
import { FontsLoad } from "../../utils/FontsLoad";
import { useBleContext } from "../../context/BLEProvider";

const LocksToggle = () => {
  const toast = useToast();
  const { isLocked, setDeviceIsLocked } = useAppSettingContext();
  const { writeLockToggleToDevice, connectedDevice } = useBleContext();
  useEffect(() => {
    FontsLoad();
  }, []);
  return (
    <View style={styles.deviceLocked}>
      <Text
        style={[
          styles.lockedTxt,
          { color: connectedDevice?.device ? "white" : "grey", width: 120 },
        ]}
      >
        {isLocked ? "Device locked" : "Device unlocked"}
      </Text>
      <View
        style={[
          styles.switchOnOff,
          isLocked ? styles.flexEnd : styles.flexStart,
        ]}
      >
        <TouchableWithoutFeedback
          onPress={async () => {
            if (connectedDevice?.device) {
              try {
                await writeLockToggleToDevice([isLocked ? 0 : 1]);
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
          <View style={styles.iconBackgroundContainer}>
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
          </View>
        </TouchableWithoutFeedback>
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
    paddingRight: 0,
    textAlign: "right",
    fontFamily: "SF-Pro-Display",
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
