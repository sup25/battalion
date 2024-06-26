import { StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";
import React, { useState, useEffect } from "react";
import colors from "../../../config/Colors";
import CarthagosButton from "../../../components/CarthagosButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

import FourDigitsCode from "../../../components/FourDigitsCode";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useBleContext } from "../../../context/BLEProvider";
import { storeFourDigitsToTheDb } from "../../../api/devices";
import { useToast } from "react-native-toast-notifications";
import { FontsLoad } from "../../../utils/FontsLoad";
import { useAppSettingContext } from "../../../context/AppSettingProvider";

export default function FourDigitCodeInsertScreen({ navigation }) {
  const { setDevicePassword } = useAppSettingContext();
  const { writePasswordToDevice, connectedDevice } = useBleContext();
  const [digitValues, setDigitValues] = useState([]);
  const [combinedSerialNum, setCombinedSerialNum] = useState("");
  const [show, setShow] = useState(true);

  const toast = useToast();

  const fetchCombinedSerialNum = async () => {
    try {
      const storedCombinedSerialNum = await AsyncStorage.getItem(
        "combinedSerialNum"
      );
      if (storedCombinedSerialNum) {
        setCombinedSerialNum(storedCombinedSerialNum);
      }
    } catch (error) {
      console.log("Error fetching combinedSerialNum from AsyncStorage:", error);
    }
  };
  useEffect(() => {
    fetchCombinedSerialNum();
    FontsLoad();
  }, []);

  const handleConfirm = async (setIsLoading) => {
    setIsLoading(true);
    if (digitValues.length < 4) {
      console.log("Please enter 4 digits");
      throw new Error("Please enter 4 digits");
    }

    if (connectedDevice?.device) {
      try {
        await writePasswordToDevice(digitValues); // set to ble device
        setDevicePassword(digitValues); //set to the state + async
        await storeFourDigitsToTheDb(combinedSerialNum, digitValues); // set to the database
        setIsLoading(false);
        navigation.navigate("mainDeviceDetails");
      } catch (error) {
        setIsLoading(false);
        toast.show(
          "Error writing password to device, please check device connection.",
          {
            type: "normal",
          }
        );

        throw error;
      }
    } else {
      setIsLoading(false);
      toast.show(
        "Error writing password to device, please check device connection.",
        {
          type: "normal",
        }
      );

      throw new Error("No device connected");
    }

    // Reset the digitValues
    setDigitValues([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.heading}>4 digits password</Text>
        <Text style={styles.paragraph}>
          Input a customizable password to your liking that you will use to
          unlock this box.
        </Text>
        <Text style={styles.paragraph}>
          Note: you can change this password later in your settings.
        </Text>
        <View
          style={{
            backgroundColor: "#131313",
            borderRadius: 5,
            height: 167,

            marginTop: 20,
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => setShow((prevShow) => !prevShow)}
          >
            <View style={styles.icon}>
              <MaterialCommunityIcons
                name={show ? "eye-off" : "eye"}
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
        </View>
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
    marginTop: 100,
    alignSelf: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: "center",
    paddingTop: 0,
  },
  heading: {
    fontSize: 24,
    fontWeight: "500",
    lineHeight: 29,
    letterSpacing: 0.02,
    textAlign: "center",
    color: colors.white,
    fontFamily: "SF-Pro-Display",
  },
  paragraph: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 19,
    color: "#8F8F8F",
    width: 320,
    textAlign: "center",
    marginTop: 8,
    alignSelf: "center",
    fontFamily: "SF-Pro-Display",
  },
  icon: {
    alignSelf: "flex-end",
    paddingTop: 25,
    paddingRight: 25,
    marginBottom: 15,
  },

  wrapper: {
    display: "flex",
    marginTop: 150,
  },
});
