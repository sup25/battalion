import {
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import colors from "../../config/Colors/colors";
import TextLogo from "../../assets/TextLogo";
import useBLE from "../../Hooks/UseBle";
import { useBleContext } from "../../utils/BLEProvider";
import PulseAnimation from "./PulseAnimation";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SearchScreen = ({ navigation }) => {
  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState(null);
  const [error, setError] = useState();
  const {
    requestPermissions,
    scanForPeripherals,
    connectToDevice,

    stopScanning,

    scan,
    connectedDevice,
  } = useBleContext();

  useEffect(() => {
    console.log("scan ble error", error);
  }, [error]);
  const init = async () => {
    let isPermitted = await requestPermissions();
    if (isPermitted) {
      scanForPeripherals(setError, new Date());
      let timer = setTimeout(() => {
        stopScanning();
        clearTimeout(timer);
      }, 18750);
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
      {scan.scanning && <PulseAnimation />}
      <View style={styles.FoundDeviceAndTxtWrapper}>
        <Text style={styles.TitleTxt}>Searching for devices</Text>

        <View style={styles.FoundDevice}>
          {scan.devices &&
            scan.devices.map((device, index) => {
              const isSelected = selectedDeviceIndex === index;
              console.log(
                `Device at index ${index} - isSelected: ${isSelected}`
              );
              return (
                <TouchableOpacity
                  style={[styles.button]}
                  onPress={async () => {
                    console.log("Clicked on device:", device);
                    if (connectedDevice.connecting) {
                      return false;
                    }
                    stopScanning();
                    try {
                      const res = await connectToDevice(device);
                      setSelectedDeviceIndex((prevIndex) =>
                        prevIndex === index ? null : index
                      );
                      navigation.navigate("Home");
                    } catch (err) {
                      console.log("err to connect", err);
                    }
                  }}
                  key={index}
                >
                  <Image
                    source={require("../../assets/product.png")}
                    style={{ width: 71, height: 60 }}
                  />
                  <Text style={styles.buttonText}>
                    {connectedDevice.connecting
                      ? "connecting..."
                      : device?.name || "no name"}
                  </Text>

                  {isSelected && (
                    <MaterialCommunityIcons
                      name="check-circle"
                      color="white"
                      size={20}
                      style={{ zIndex: 999, marginLeft: 5 }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
        </View>
      </View>

      {error && <Text style={{ color: colors.white }}>{error}</Text>}
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
    backgroundColor: colors.white,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  FoundDeviceAndTxtWrapper: {
    justifyContent: "space-between",
  },
  FoundDevice: {
    zIndex: 99,
    paddingTop: 80,
  },

  TitleTxt: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "500",
    textAlign: "center",
    width: 171,
    paddingTop: 63,
    alignItems: "center",
    alignSelf: "center",
  },
  button: {
    backgroundColor: "#131313",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
  },
  buttonText: {
    color: "white",
  },
});
