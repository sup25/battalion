import {
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React, { useEffect } from "react";
import colors from "../../config/Colors/colors";
import TextLogo from "../../assets/TextLogo";
import useBLE from "../../Hooks/UseBle";
import { useBleContext } from "../../utils/BLEProvider";
import PulseAnimation from "./PulseAnimation";

const SearchScreen = ({ navigation }) => {
  const {
    requestPermissions,
    scanForPeripherals,
    connectToDevice,

    stopScanning,

    scan,
    connectedDevice,
  } = useBleContext();

  const init = async () => {
    let isPermitted = await requestPermissions();
    if (isPermitted) {
      scanForPeripherals();
    }
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          flex: 1,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2,
        }}
      >
        <View style={styles.circle}>
          <View style={styles.logo}>
            <TextLogo />
          </View>
        </View>
      </View>
      {scan.scanning ? (
        <PulseAnimation />
      ) : (
        <View>
          <View style={styles.Text}>
            <Text style={styles.txtFirst}>Searching for devices</Text>
          </View>

          <View>
            {scan.devices &&
              scan.devices.map((device, index) => {
                return (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={async () => {
                      if (connectedDevice.connecting) {
                        return false;
                      }
                      stopScanning();
                      try {
                        const res = await connectToDevice(device);
                        navigation.navigate("Home");
                      } catch (err) {
                        console.log("err to connect", err);
                      }
                    }}
                    key={index}
                  >
                    <Text style={styles.buttonText}>
                      {connectedDevice.connecting
                        ? "connecting..."
                        : device?.name || "no name"}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  circle: {
    width: 210,
    height: 210,
    display: "flex",
    alignSelf: "center",
    backgroundColor: colors.black,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
  button: {
    backgroundColor: "#3498db",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
});
