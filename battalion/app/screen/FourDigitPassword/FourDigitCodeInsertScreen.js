import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import colors from "../../config/Colors/colors";
import CarthagosButton from "../../component/CarthagosButton/CarthagosButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/Firebase";
import { useAppSettingContext } from "../../context/AppSettingContext";
import FourDigitsCode from "../../component/FourDigitsCode";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useBleContext } from "../../utils/BLEProvider";

export default function FourDigitCodeInsertScreen({ route }) {
  const { password, setDevicePassword } = useAppSettingContext();
  const { writePasswordToDevice } = useBleContext();
  const [digitValues, setDigitValues] = useState(password);
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

  const storeFourDigitsToTheDb = async (fourDigits) => {
    try {
      // Convert digitValues to an array of numbers
      const digitValuesAsNumbers = digitValues.map((value) =>
        parseInt(value, 10)
      );

      // Update the context and AsyncStorage
      setDevicePassword(digitValuesAsNumbers);

      // Update the Firestore document with the new password
      const deviceRef = doc(collection(db, "devices"), combinedSerialNum);
      await updateDoc(deviceRef, {
        fourDigitCode: digitValuesAsNumbers,
      });

      console.log("Password updated successfully");
    } catch (error) {
      console.log("Error updating password:", error.message);
      throw error;
    }
  };

  const handleConfirm = async () => {
    if (digitValues.length < 4) {
      console.log("Please enter 4 digits");
      throw new Error("Please enter 4 digits");
    }

    setPasswordError();
    if (connectedDevice.device) {
      try {
        await writePasswordToDevice(pass); // set to ble device
        setDevicePassword(pass); //set to the state + async
        storeFourDigitsToTheDb(pass); // set to the database
        setPasswordError(); // reset error handling
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
        <FourDigitsCode defaultValue={digitValues} isVisible={show} />
        {passwordError && <Text style={styles.paragraph}>{passwordError}</Text>}

        <View style={styles.button}>
          <CarthagosButton
            title="confirm"
            textColor="white"
            width={277}
            onPress={handleConfirm}
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
