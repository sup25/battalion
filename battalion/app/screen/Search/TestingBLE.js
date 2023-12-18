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

import { setPasswordToDevice, setTimeToDevice } from "../../BLEfunctions";
import useBLE from "../../Hooks/UseBle";
import { useBleContext } from "../../utils/BLEProvider";
import { useAppSettingContext } from "../../context/AppSettingContext";

const TestingBLE = ({ navigation }) => {
  const { getStatusFromDevice, writePasswordToDevice, disconnectFromDevice } =
    useBleContext();
  const {
    setBoxTemp,
    setDevicePassword,
    setDeviceIsLocked,
    setDeviceIsLightsOn,
  } = useAppSettingContext();
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const closePopup = () => {
    setPopupVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => writePasswordToDevice()}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Set Password</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          getStatusFromDevice({
            setBoxTemp,
            setDevicePassword,
            setDeviceIsLocked,
            setDeviceIsLightsOn,
          })
        }
        style={styles.button}
      >
        <Text style={styles.buttonText}>Get status</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => disconnectFromDevice()}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Disconnect</Text>
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
