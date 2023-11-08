import {
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  View,
  TouchableOpacity,
} from "react-native";
import React from "react";
import colors from "../../config/colors";
import TextLogo from "../../assets/TextLogo";
import useBLE from "../../Hooks/UseBle";

const SearchScreen = ({ navigation }) => {
  const {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
    heartRate,
  } = useBLE();

  console.log(connectedDevice);
  return (
    <View style={styles.container}>
      <View style={styles.Text}>
        <Text style={styles.txtFirst}>Searching for devices</Text>
      </View>
      <View style={styles.circle}>
        <View style={styles.logo}>
          <TextLogo />
        </View>
      </View>
      <View>
        {allDevices &&
          allDevices.map((device, index) => {
            console.log(device);
            return (
              <TouchableOpacity
                onPress={() => connectToDevice(device)}
                key={index}
              >
                {device?.name || "no name"}
              </TouchableOpacity>
            );
          })}
      </View>
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  circle: {
    width: 210,
    height: 210,
    display: "flex",
    alignSelf: "center",
    backgroundColor: colors.medium,
    borderRadius: 999,
    top: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },

  Text: {
    width: "100%",
    marginTop: 76,
    alignItems: "center",
  },

  txtFirst: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "500",
    textAlign: "center",
    maxWidth: 181,
    alignItems: "center",
  },
});
