import { useEffect, useState } from "react";
import { useAppSettingContext } from "../../context/AppSettingContext/AppSettingContext";
import { useBleContext } from "../../utils/BLEProvider/BLEProvider";
import {
  BackHandler,
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../config/Colors/colors";
import { useToast } from "react-native-toast-notifications";

const TestingBleScreen = () => {
  const toast = useToast();
  const [retry, setRetry] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState({
    device: null,
    index: null,
  });

  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("Press on the button to start testing.");
  const [functionIndex, setFunctionIndex] = useState(0);

  const {
    setConnectedDevice,
    setDevicePassword,
    setTempUnit,
    setTempValue,
    setDeviceIsLocked,
    setDeviceIsLightsOn,
  } = useAppSettingContext();

  const {
    setScan,

    requestPermissions,
    scanForPeripherals,
    connectToDevice,

    stopScanning,

    scan,
    connectedDevice,

    getStatusFromDevice,
  } = useBleContext();

  let timer = null;

  const init = async () => {
    let isPermitted = await requestPermissions();
    if (isPermitted) {
      setScan((prev) => ({ ...prev, devices: [], error: false }));
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

  const executeAsyncFunctions = async () => {
    try {
      switch (functionIndex) {
        case 0:
          setMessage("getting data from device");
          const data = await getStatusFromDevice();

          setTitle("getting data from device");
          try {
            setMessage(JSON.stringify(data));
          } catch (err) {
            setMessage(`error getting data from device: ${err.message}`);
          }
          break;

        default:
          setMessage("Test is done!");
          setTitle("Test is done!");
          break;
      }

      setFunctionIndex((prevIndex) => prevIndex + 1);
    } catch (error) {
      console.error("Error during execution:", error);
      setMessage("An error occurred during execution");
    }
  };

  const handleButtonClick = () => {
    executeAsyncFunctions();
  };

  const toShowRetry = () => {
    return (
      scan.error ||
      (scan?.devices?.length === 0 && !scan.scanning && !connectedDevice.device)
    );
  };
  return (
    <View style={styles.container}>
      <View>
        {scan.devices &&
          scan.devices.map((device, index) => {
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
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
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
        {selectedDevice.device && connectedDevice.device && !scan.scanning && (
          <View>
            <Text style={{ color: "white", marginBottom: 20, fontSize: 18 }}>
              {title}
            </Text>
            <Text style={{ color: "white", marginBottom: 20 }}>{message}</Text>
            {functionIndex <= 1 && (
              <Button
                title={functionIndex === 0 ? "Start testing" : "Next Test"}
                onPress={handleButtonClick}
              />
            )}
          </View>
        )}
      </View>
      <View>
        {scan.scanning && (
          <Text style={{ color: "white" }}>Searching for devices...</Text>
        )}

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
            <Text style={{ color: "white" }}>Retry</Text>
          </TouchableOpacity>
        )}
        {selectedDevice.device && !connectedDevice.device && (
          <TouchableOpacity
            onPress={async () => {
              if (connectedDevice?.connecting || !selectedDevice.device) {
                return false;
              }
              stopScanning();
              try {
                await connectToDevice(selectedDevice.device);
                await setConnectedDevice(selectedDevice.device);
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
            }}
          >
            <Text style={{ color: "white" }}>
              {connectedDevice?.connecting ? "CONNECTING..." : "CONNECT DEVICE"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default TestingBleScreen;

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
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 60,
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
    width: 171,
    marginBottom: 30,
    alignItems: "center",
    alignSelf: "center",
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
