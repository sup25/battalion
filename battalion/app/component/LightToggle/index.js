import { StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";
import { useAppSettingContext } from "../../context/AppSettingContext";
import colors from "../../config/Colors/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const LightToggle = () => {
  const { isLightsOn, setDeviceIsLightsOn } = useAppSettingContext();

  return (
    <View style={styles.brightness}>
      <Text style={styles.brightnessTxt}>Light Auto</Text>
      <View
        style={[
          styles.switchOnOff,
          isLightsOn ? styles.flexEnd : styles.flexStart,
        ]}
      >
        <View style={styles.iconBackgroundContainer}>
          <TouchableWithoutFeedback
            onPress={() => {
              setDeviceIsLightsOn(!isLightsOn);
            }}
          >
            {isLightsOn ? (
              <MaterialCommunityIcons
                name="brightness-5"
                size={20}
                color="#B0B0B0"
              />
            ) : (
              <MaterialCommunityIcons
                name="brightness-5"
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

export default LightToggle;

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
