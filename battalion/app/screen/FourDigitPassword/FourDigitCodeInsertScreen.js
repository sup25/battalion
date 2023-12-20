import { StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";
import React, { useState, useEffect } from "react";
import colors from "../../config/Colors/colors";
import CarthagosButton from "../../component/CarthagosButton/CarthagosButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppSettingContext } from "../../context/AppSettingContext/AppSettingContext";
import FourDigitsCode from "../../component/FourDigitsCode";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useBleContext } from "../../utils/BLEProvider/BLEProvider";
import { storeFourDigitsToTheDb } from "../../api/Database/Database";

export default function FourDigitCodeInsertScreen({ navigation }) {
  const { setDevicePassword } = useAppSettingContext();
  const { writePasswordToDevice, connectedDevice } = useBleContext();
  const [digitValues, setDigitValues] = useState([]);
  const [combinedSerialNum, setCombinedSerialNum] = useState("");
  const [show, setShow] = useState(false);
  const [passwordError, setPasswordError] = useState();

  useEffect(() => {
    const fetchCombinedSerialNum = async () => {
      try {
        const storedCombinedSerialNum = await AsyncStorage.getItem(
          "combinedSerialNum"
        );
        if (storedCombinedSerialNum !== null) {
          setCombinedSerialNum(storedCombinedSerialNum);
        }
      } catch (error) {
        console.log(
          "Error fetching combinedSerialNum from AsyncStorage:",
          error
        );
      }
    };

    fetchCombinedSerialNum();
  }, []);

  const handleConfirm = async (setIsLoading) => {
    setIsLoading(true);
    if (digitValues.length < 4) {
      console.log("Please enter 4 digits");
      throw new Error("Please enter 4 digits");
    }

    setPasswordError();
    if (connectedDevice.device) {
      try {
        await writePasswordToDevice(digitValues); // set to ble device
        setDevicePassword(digitValues); //set to the state + async
        await storeFourDigitsToTheDb(
          combinedSerialNum,
          digitValues,
          setPasswordError
        ); // set to the database
        setIsLoading(false);
        navigation.navigate("Home");
      } catch (error) {
        setIsLoading(false);
        setPasswordError(
          "Error writing password to device, please check device connection."
        );
        throw error;
      }
    } else {
      setIsLoading(false);
      setPasswordError(
        "Error writing password to device, please check device connection."
      );
      throw new Error("No device connected");
    }

    // Reset the digitValues
    setDigitValues([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.heading}>4 digit password</Text>
        <Text style={styles.paragraph}>
          Input the password to unlock the box in the digital display, you can
          change this password later in the settings.
        </Text>
        <TouchableWithoutFeedback
          onPress={() => setShow((prevShow) => !prevShow)}
        >
          <View style={styles.icon}>
            <MaterialCommunityIcons
              name={show ? "eye" : "eye-off"}
              size={30}
              color={colors.white}
            />
          </View>
        </TouchableWithoutFeedback>
        <FourDigitsCode
          defaultValue={digitValues}
          isVisible={show}
          submitHandler={setDigitValues}
        />
        {passwordError && <Text style={styles.paragraph}>{passwordError}</Text>}

        <View style={styles.button}>
          <CarthagosButton
            title="confirm"
            textColor="white"
            width={277}
            onPress={(setIsLoading) => handleConfirm(setIsLoading)}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    alignSelf: "center",
    bottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: colors.black,
    paddingHorizontal: 15,
    alignItems: "center",
    paddingTop: 75,
  },
  heading: {
    fontSize: 24,
    fontWeight: "500",
    lineHeight: 29,
    letterSpacing: 0.02,
    textAlign: "center",
    color: colors.white,
  },
  paragraph: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 19,
    color: "#8F8F8F",
    width: 300,
    textAlign: "center",
    marginTop: 8,
    alignSelf: "center",
  },
  icon: {
    alignSelf: "flex-end",
    paddingTop: 33,
    paddingRight: 49,
  },
  textInput: {
    height: 65,
    borderColor: colors.secondary,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 5,
    width: 61,
    borderRadius: 5,
    color: colors.white,
    fontSize: 24,
    display: "flex",
    textAlign: "center",
  },
  textInputContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginTop: 33,
  },
  wrapper: {
    justifyContent: "center",
    marginTop: 115,
  },
});
