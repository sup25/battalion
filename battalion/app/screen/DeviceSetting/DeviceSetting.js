import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";

import React, { useState } from "react";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../config/Colors/colors";

import { useAppSettingContext } from "../../context/AppSettingContext/AppSettingContext";
import FourDigitsCode from "../../component/FourDigitsCode";
import { useBleContext } from "../../utils/BLEProvider/BLEProvider";

const DeviceSetting = ({ navigation }) => {
  const [show, setShow] = useState(false);
  const [passwordError, setPasswordError] = useState();
  const { temp, setTempUnit, password, setDevicePassword } =
    useAppSettingContext();
  const { connectedDevice, writePasswordToDevice } = useBleContext();
  const [temperatureToggle, setTemperatureToggle] = useState(false);

  const handleShowPassword = () => {
    setShow(!show);
  };

  const handleTemperatureChange = () => {
    setTemperatureToggle(!temperatureToggle);
    setTempUnit(temp.unit === "c" ? "f" : "c");
  };

  const submitPassword = async (pass) => {
    setPasswordError();
    if (connectedDevice?.device) {
      try {
        await writePasswordToDevice(pass);
        setDevicePassword(pass);
        setPasswordError();
      } catch (error) {
        console.log("Error writing password to device:", error);
        setPasswordError(
          "Error writing password to device, please check device connection."
        );
        throw error;
      }
    } else {
      setPasswordError(
        "Error writing password to device, please check device connection."
      );
      throw new Error("No device connected");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <TouchableWithoutFeedback onPress={() => navigation.goBack(null)}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={30}
            color="#FFFFFF82"
          />
        </TouchableWithoutFeedback>
        <Text style={styles.txtHeading}>Device Settings</Text>
      </View>

      <View style={styles.systemContainer}>
        <Text style={styles.metricTxt}>Metric System</Text>
        <View style={styles.temperatureContainer}>
          <Text style={styles.tempTxt}>Fahrenheit / Celsius</Text>
          <TouchableWithoutFeedback onPress={handleTemperatureChange}>
            <View
              style={[
                styles.switchOnOff,
                temperatureToggle ? styles.flexEnd : styles.flexStart,
              ]}
            >
              <View style={styles.iconBackgroundContainer}>
                <Text style={styles.temperatureIndicatortxt}>
                  {temp.unit === "c" ? "°C" : "°F"}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
      <View style={styles.passwordContainer}>
        <View style={styles.passwordIcon}>
          <Text style={styles.digitTxt}>4 digit password</Text>
          <TouchableWithoutFeedback onPress={handleShowPassword}>
            <MaterialCommunityIcons
              name={show ? "eye" : "eye-off"}
              size={30}
              color={colors.white}
            />
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.boxContainer}>
          <FourDigitsCode
            submitHandler={submitPassword}
            defaultValue={password}
            isVisible={show}
            passwordError={passwordError}
          />
        </View>
      </View>
    </View>
  );
};

export default DeviceSetting;

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#1E1E1E6E",
    width: 70,
    height: 72,
    borderWidth: 1,
    borderColor: "#FFFFFF30",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  boxContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    marginTop: 5,
  },

  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  digitTxt: {
    color: colors.white,
    fontWeight: "500",
    fontSize: 18,
  },
  flexEnd: {
    justifyContent: "flex-end",
    backgroundColor: colors.primary,
  },
  flexStart: {
    justifyContent: "flex-start",
    backgroundColor: "#424242",
  },
  heading: {
    flexDirection: "row",
    paddingHorizontal: 15,
    marginTop: 55,
    alignItems: "center",
  },
  iconBackgroundContainer: {
    width: 34,
    height: 34,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  metricTxt: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.white,
  },

  passwordContainer: {
    width: 335,
    height: 162,
    backgroundColor: "#131313",
    alignSelf: "center",
    padding: 10,
    borderRadius: 5,
    marginTop: 14,
    flexDirection: "column",
  },
  passwordIcon: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchOnOff: {
    width: 60,
    height: 24,
    borderRadius: 18,
    transform: [{ translateY: 0 }],
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  systemContainer: {
    width: 335,
    height: 106,
    backgroundColor: "#131313",
    alignSelf: "center",
    padding: 10,
    borderRadius: 5,
    marginTop: 17,
  },
  temperatureIndicatortxt: {
    fontSize: 16,
    fontWeight: "500",
  },
  tempTxt: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.white,
  },
  temperatureContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    alignItems: "center",
  },
  txtHeading: {
    fontSize: 32,
    fontWeight: "900",
    textTransform: "uppercase",
    color: colors.white,
    marginLeft: 9,
  },
  textInput: {
    fontSize: 32,
    color: colors.white,
    borderWidth: 1,
    borderColor: "#1E1E1E6E",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});
