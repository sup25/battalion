import {
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  View,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback,
  BackHandler,
} from "react-native";
import React, { useEffect, useState } from "react";
import colors from "../../config/Colors/colors";
import TextLogo from "../../assets/TextLogo";
import useBLE from "../../Hooks/UseBle/UseBle";
import { useBleContext } from "../../utils/BLEProvider/BLEProvider";
import PulseAnimation from "../PulseAnimation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useToast } from "react-native-toast-notifications";
import { useRoute } from "@react-navigation/native";
import { useAppSettingContext } from "../../context/AppSettingContext/AppSettingContext";
import { FontsLoad } from "../../utils/FontsLoad";

const SearchScreen = ({ navigation }) => {
  const toast = useToast();
  const route = useRoute();
  const { isFirstTime = false, serialNum = false, id = false } = route.params;
  const [retry, setRetry] = useState(false);

  const [selectedDevice, setSelectedDevice] = useState({
    device: null,
    index: null,
  });

  const { setConnectedDevice } = useAppSettingContext();
  const {
    setScan,

    requestPermissions,
    scanForPeripherals,
    connectToDevice,

    stopScanning,

    scan,
    connectedDevice,
  } = useBleContext();

  let timer = null;

  const init = async () => {
    setScan((prev) => ({ ...prev, devices: [], error: false }));
    let isPermitted = await requestPermissions();
    if (isPermitted) {
      scanForPeripherals(toast, new Date());
      timer = setTimeout(() => {
        stopScanning();
        clearTimeout(timer);
      }, 18750);
    }
  };

  useEffect(() => {
    if (!timer) {
      init();
    }
    const backAction = () => {
      clearTimeout(timer);
      stopScanning();
      setScan((prev) => ({ ...prev, devices: [] }));
      return false; // Prevent default back button behavior
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Clean up the event listener

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retry]);
  useEffect(() => {
    FontsLoad();
  }, []);

  const toShowRetry = () => {
    console.log("scan", scan);
    return scan.error || (scan?.devices?.length === 0 && !scan.scanning);
  };

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
        <View style={styles.FoundDevice}>
          <Text style={styles.TitleTxt}>
            {scan.scanning
              ? "Searching for devices"
              : scan?.devices?.length > 0
              ? "Found devices"
              : "No devices found"}
          </Text>
          {scan.devices &&
            scan.devices
              .filter((item) => (id ? item.id === id : true))
              .map((device, index) => {
                return (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      setSelectedDevice({ index, device });
                    }}
                    key={index}
                  >
                    <View
                      style={[
                        styles.button,
                        {
                          borderColor:
                            selectedDevice.index === index
                              ? "white"
                              : "transparent",
                          borderWidth: 1,
                        },
                      ]}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Image
                          source={require("../../assets/product.png")}
                          style={{ width: 71, height: 60 }}
                        />
                        <Text style={styles.buttonText}>
                          {device?.name || "no name"}
                        </Text>
                      </View>
                      <MaterialCommunityIcons
                        name="check-circle"
                        color="white"
                        size={20}
                        style={{
                          zIndex: 999,
                          marginLeft: 5,
                          opacity: selectedDevice.index === index ? 1 : 0,
                        }}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                );
              })}
        </View>
        <View>
          {toShowRetry() && (
            <TouchableOpacity
              onPress={() => setRetry((prev) => !prev)}
              style={{
                backgroundColor: colors.primary,
                width: 277,
                height: 60,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
                fontSize: 20,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: "Alternate-Gothic",
                  textTransform: "uppercase",
                  fontWeight: "700",
                  fontSize: 20,
                }}
              >
                Retry
              </Text>
            </TouchableOpacity>
          )}
          {selectedDevice.device && (
            <TouchableOpacity
              onPress={async () => {
                if (connectedDevice?.connecting || !selectedDevice.device) {
                  return false;
                }
                stopScanning();
                try {
                  await connectToDevice(selectedDevice.device);
                  await setConnectedDevice(selectedDevice.device);
                  if (!connectedDevice.hasPassword) {
                    navigation.navigate("fourdigitcodeinsertscreen");
                  } else {
                    navigation.navigate("Home");
                  }
                } catch (err) {
                  console.log("err to connect", err);
                  toast.show(
                    "Couldn't connect to the device, please try again.",
                    {
                      type: "normal",
                    }
                  );
                }
              }}
              style={{
                backgroundColor: colors.primary,
                width: 277,
                height: 60,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
                fontSize: 20,
                fontFamily: "Alternate-Gothic",
              }}
            >
              <Text style={{ color: "white", fontFamily: "SF-Pro-Display" }}>
                {connectedDevice?.connecting
                  ? "CONNECTING..."
                  : "CONNECT DEVICE"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
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
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 60,
    zIndex: 99,
  },
  FoundDevice: {
    zIndex: 99,
  },

  TitleTxt: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "500",
    textAlign: "center",
    width: 300,
    marginBottom: 30,
    alignItems: "center",
    alignSelf: "center",
    fontFamily: "SF-Pro-Display",
  },
  button: {
    backgroundColor: "#131313",
    padding: 20,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: 355,
  },
  buttonText: {
    color: "white",
    marginLeft: 10,
  },
});
