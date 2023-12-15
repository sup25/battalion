import {
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import colors from "../../config/Colors/colors";
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
    scanning,
    stopScanning,
  } = useBLE();

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
    <View style={styles.container}>
      {scanning ? (
        <Text>Scanning...</Text>
      ) : (
        <View>
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
                return (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={async () => {
                      try {
                        stopScanning();

                        const res = await connectToDevice(device);
                        navigation.navigate("testingBLE");
                        console.log(res);
                      } catch (err) {
                        console.log("err to connect", err);
                      }
                    }}
                    key={index}
                  >
                    <Text style={styles.buttonText}>
                      {device?.name || "no name"}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>
      )}
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
    backgroundColor: colors.white,
    borderRadius: 999,
    top: 100,
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
