import { StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";
import { useAppSettingContext } from "../../context/AppSettingContext/AppSettingContext";
import colors from "../../config/Colors/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useBleContext } from "../../utils/BLEProvider/BLEProvider";
import { useToast } from "react-native-toast-notifications";

const LightsToggle = () => {
  const toast = useToast();
  const { isLightsOn, setDeviceIsLightsOn, temp } = useAppSettingContext();
  const { writeLightsToDevice, connectedDevice } = useBleContext();
  return (
    <View style={styles.brightness}>
      <Text
        style={[
          styles.brightnessTxt,
          { color: connectedDevice?.device ? "white" : "grey" },
        ]}
      >
        {isLightsOn ? "Lights Auto" : "Lights Off"}
      </Text>
      <View
        style={[
          styles.switchOnOff,
          isLightsOn ? styles.flexEnd : styles.flexStart,
        ]}
      >
        <TouchableWithoutFeedback
          onPress={async () => {
            if (connectedDevice?.device) {
              try {
                await writeLightsToDevice([isLightsOn ? 0 : 1], temp);
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
          <View style={styles.iconBackgroundContainer}>
            {isLightsOn ? (
              <MaterialCommunityIcons
                name="brightness-5"
                size={20}
                color={connectedDevice?.device ? "black" : "#B0B0B0"}
              />
            ) : (
              <MaterialCommunityIcons
                name="brightness-2"
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

export default LightsToggle;

const styles = StyleSheet.create({
  brightness: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    marginTop: 10,
  },
  brightnessTxt: {
    width: 120,
    fontWeight: "500",
    fontSize: 14,
    color: "#B0B0B0",
    paddingLeft: 0,
    textAlign: "right",
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
