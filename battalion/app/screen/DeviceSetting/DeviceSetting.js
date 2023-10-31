import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TextInput,
  Animated,
  Easing,
} from "react-native";

import React, { useState, useEffect } from "react";
import { db } from "../../config/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../config/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
const DeviceSetting = ({ navigation }) => {
  const [fourDigitCode, setFourDigitCode] = useState("");
  const [show, setShow] = useState(false);
  const [temperatureToggle, setTemperatureToggle] = useState(false);

  let opacity = new Animated.Value(0);

  const animate = (easing) => {
    opacity.setValue(0);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1200,
      easing,
      useNativeDriver: true,
    }).start();
  };

  const handleShowPassword = () => {
    setShow(!show);
  };
  const handleTemperatureChange = () => {
    setTemperatureToggle(!temperatureToggle);
    animate(Easing.ease);
  };

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        // Retrieve the combinedSerialNumber from AsyncStorage
        const combinedSerialNumber = await AsyncStorage.getItem(
          "combinedSerialNum"
        );

        if (combinedSerialNumber) {
          const docRef = doc(db, "devices", combinedSerialNumber);

          const docSnapshot = await getDoc(docRef);

          if (docSnapshot.exists()) {
            const code = docSnapshot.data().fourDigitCode;
            setFourDigitCode(code);
            console.log(code);
          } else {
            console.log("Document not found");
          }
        } else {
          console.log("No combinedSerialNumber found in AsyncStorage");
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchDocument();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate("devicedetails")}
        >
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
            <Animated.View
              style={[
                styles.switchOnOff,
                temperatureToggle ? styles.flexEnd : styles.flexStart,
              ]}
            >
              <View style={styles.iconBackgroundContainer}>
                <Text style={styles.temperatureIndicatortxt}>
                  {temperatureToggle ? "°C" : "°F"}
                </Text>
              </View>
            </Animated.View>
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
          {fourDigitCode.split("").map((digit, index) => (
            <View key={index} style={styles.box}>
              <TextInput
                value={show ? digit : "*"}
                placeholder="*"
                placeholderTextColor="white"
                style={styles.textInput}
                editable={false}
              />
            </View>
          ))}
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
    justifyContent: "space-between",
    marginTop: 29,
  },

  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  digitTxt: {
    color: colors.white,
    fontWeight: 500,
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
    paddingHorizontal: 20,
    marginTop: 37,
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
    fontWeight: 500,
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
    fontWeight: 500,
  },
  tempTxt: {
    fontSize: 14,
    fontWeight: 500,
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
    fontWeight: 900,
    textTransform: "uppercase",
    color: colors.white,
    marginLeft: 9,
  },
  textInput: {
    fontSize: 32,
    color: colors.white,
  },
});
