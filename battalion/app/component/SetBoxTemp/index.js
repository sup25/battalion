import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppSettingContext } from "../../context/AppSettingContext/AppSettingContext";
import colors from "../../config/Colors/colors";
import { useNavigation } from "@react-navigation/native";
import { useToast } from "react-native-toast-notifications";
import { useBleContext } from "../../utils/BLEProvider/BLEProvider";

const SetBoxTemp = () => {
  const toast = useToast();
  const { connectedDevice } = useBleContext();
  const { getTempValueAndUnit, temp } = useAppSettingContext();
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.TempConatinerBg}
      onPress={() => {
        if (connectedDevice?.device) {
          navigation.navigate("halfcircle");
        } else {
          toast.show("Please connect to a device.", {
            type: "normal",
          });
        }
      }}
    >
      <View style={styles.TemptextIconWrapper}>
        <Text
          style={[
            styles.degree,
            { color: connectedDevice?.device ? "white" : "grey" },
          ]}
        >
          {getTempValueAndUnit(temp)}
        </Text>
        <MaterialCommunityIcons
          name="thermometer"
          size={32}
          color={colors.icon}
        />
      </View>
      <View
        style={[
          styles.setTextContainer,
          { opacity: connectedDevice?.device ? 1 : 0.5 },
        ]}
      >
        <Text
          style={[
            styles.setText,
            { color: connectedDevice?.device ? "white" : "grey" },
          ]}
        >
          Set the box Temperature
        </Text>
        <MaterialCommunityIcons name="arrow-right" size={20} color="white" />
      </View>
    </TouchableOpacity>
  );
};

export default SetBoxTemp;

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
  setTextContainer: {
    backgroundColor: colors.primary,
    padding: 5,
    borderRadius: 5,
    opacity: 0.5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 138,
  },
  setText: {
    width: 100,
    fontWeight: "500",
    fontSize: 15,
    color: colors.white,
  },
});
