import {
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  View,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";

import {
  getStatusFromDevice,
  setPasswordToDevice,
  setTimeToDevice,
} from "../../BLEfunctions";
import useBLE from "../../Hooks/UseBle";

const TestingBLE = ({ navigation }) => {
  const { connectedDevice } = useBLE();
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const closePopup = () => {
    setPopupVisible(false);
  };

  const setPassword = async (password) => {
    try {
      const result = await setPasswordToDevice(connectedDevice, password);
      setPopupMessage(result);
      console.log(JSON.stringify(result)); // Output: "Password set successfully."
    } catch (error) {
      setPopupMessage(
        "Error setting password: " +
          error.message +
          " " +
          error.code +
          " " +
          error.name +
          " " +
          JSON.stringify(error)
      );
      console.error("Error setting password:", error);
    } finally {
      setPopupVisible(true);
    }
  };

  const getStatus = async () => {
    try {
      const result = await getStatusFromDevice(ble);
      setPopupMessage(JSON.stringify(result));
      console.log(result); // Output: "Password set successfully."
    } catch (error) {
      setPopupMessage(
        "Error getting status: " +
          error.message +
          " " +
          error.code +
          " " +
          error.name +
          " " +
          JSON.stringify(error)
      );
      console.error("Error getting status:", error);
    } finally {
      setPopupVisible(true);
    }
  };

  const setTime = async (timeData) => {
    try {
      const result = await setTimeToDevice(connectedDevice, timeData);
      setPopupMessage(JSON.stringify(result));
      console.log(result); // Output: "Password set successfully."
    } catch (error) {
      setPopupMessage(
        "Error getting status: " +
          error.message +
          " " +
          error.code +
          " " +
          error.name +
          " " +
          JSON.stringify(error)
      );
      console.error("Error getting status:", error);
    } finally {
      setPopupVisible(true);
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setPassword([0x01, 0x02, 0x03, 0x04])}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Set Password</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => getStatus()} style={styles.button}>
        <Text style={styles.buttonText}>Get status</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          setTime(0x01, 0x04, 0x04, 0x04, [0x01, 0x02, 0x03, 0x04])
        }
        style={styles.button}
      >
        <Text style={styles.buttonText}>Set time</Text>
      </TouchableOpacity>

      <Popup
        isVisible={popupVisible}
        message={popupMessage}
        onClose={closePopup}
      />
    </View>
  );
};

export default TestingBLE;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
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
        <View
          style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}
        >
          <Text>{JSON.stringify(message)}</Text>
          <TouchableOpacity onPress={onClose} style={{ marginTop: 20 }}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
