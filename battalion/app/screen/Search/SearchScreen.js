import {
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import colors from "../../config/colors";
import TextLogo from "../../assets/TextLogo";
import useBLE from "../../Hooks/UseBle";
import PulseAnimation from "./subComp/searchPulse";
import Spinner from "../../component/Spinner";
import { useBleContext } from "../../utils/BLEProvider";

const SearchScreen = ({ navigation }) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const { setDevice, device: providedDevice } = useBleContext();

  const [loading, setLoading] = useState({ value: false, index: null });

  const closePopup = () => {
    setPopupVisible(false);
  };
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
      scanForPeripherals(setPopupMessage, setPopupVisible);
    }
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <View style={styles.container}>
      <View>
        {scanning && (
          <Text style={styles.Text}>
            <Spinner />
            Scanning...
          </Text>
        )}
      </View>
      <View>
        {/* <View style={styles.Text}>
          <Text style={styles.txtFirst}>Searching for devices</Text>
        </View>
        <View style={styles.circle}>
          <View style={styles.logo}>
            <TextLogo />
          </View>
        </View> */}
        <View>
          {allDevices &&
            allDevices.map((device, index) => {
              return (
                <TouchableOpacity
                  style={[styles.button, loading.value && styles.buttonLoading]}
                  disabled={loading.value}
                  onPress={async () => {
                    setLoading({ value: true, index });
                    try {
                      const res = await connectToDevice(device, setDevice);

                      setTimeout(() => {
                        navigation.navigate("testingBLE");
                      }, 3000);
                    } catch (err) {
                      setLoading({ value: false, index: null });
                      setPopupMessage(
                        `${err.message}, code: ${err.code}, name: ${err.name}`
                      );
                      setPopupVisible(true);
                      console.log("err to connect", err);
                    }
                  }}
                  key={index}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      loading.index === index &&
                        loading.value &&
                        styles.buttonTextLoading,
                    ]}
                  >
                    {loading.index === index && loading.value ? (
                      <Text>
                        <Spinner />
                        connecting...
                      </Text>
                    ) : (
                      device?.name || "no name"
                    )}
                  </Text>
                </TouchableOpacity>
              );
            })}
        </View>
      </View>
      <View>
        {!scanning && (
          <View>
            <Text>Cant see your device?</Text>
            <Text>Make sure the device is on and try again</Text>
            <TouchableOpacity
              style={[styles.button]}
              onPress={() => {
                scanForPeripherals(setPopupMessage, setPopupVisible);
              }}
            >
              <Text style={[styles.buttonText]}>Scan again</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Popup
        isVisible={popupVisible}
        message={popupMessage}
        onClose={closePopup}
      />
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
    paddingLeft: 15,
    paddingRight: 15,
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "space-between",
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
  buttonLoading: {
    backgroundColor: "grey", // Change to the desired background color for loading state
  },
  buttonText: {
    color: "white",
  },
  buttonTextLoading: {
    color: "#CCCCCC",
  },
});

const Popup = ({ isVisible, message, onClose }) => {
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <ScrollView
          style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}
        >
          <Text>{JSON.stringify(message)}</Text>
          <TouchableOpacity onPress={onClose} style={{ marginTop: 20 }}>
            <Text>Close</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};
