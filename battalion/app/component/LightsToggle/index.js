import { StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";
import { useAppSettingContext } from "../../context/AppSettingContext/AppSettingContext";
import colors from "../../config/Colors/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useBleContext } from "../../utils/BLEProvider/BLEProvider";
import { useToast } from "react-native-toast-notifications";

const LightsToggle = () => {
  const toast = useToast();
  const { isLightsOn, setDeviceIsLightsOn } = useAppSettingContext();
  const { writeLightsToDevice, connectedDevice } = useBleContext();
  return (
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
                  await writeLightsToDevice([!isLightsOn === false ? 0 : 1]);
                  setDeviceIsLightsOn(!isLightsOn);
                } catch (err) {
                  toast.show("Error writing to device, try to reconnect.", {
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
  );
};

export default LightsToggle;

const styles = StyleSheet.create({
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
    paddingLeft: 0,
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
