import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { db } from "../config/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";

const DeviceSetting = ({ navigation }) => {
  const [fourDigitCode, setFourDigitCode] = useState("");
  const [show, setShow] = useState(false);
  const handleShowPassword = () => {
    setShow(!show);
  };

  useEffect(() => {
    const fetchDocument = async () => {
      const documentID = "123455789012";
      const docRef = doc(db, "devices", documentID);

      try {
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const code = docSnapshot.data().fourDigitCode;
          setFourDigitCode(code);
          console.log(code);
        } else {
          console.log("Document not found");
        }
      } catch (error) {
        console.log("Error getting document:", error);
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
          <MaterialCommunityIcons name="circle" size={20} color="white" />
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
  heading: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 37,
    alignItems: "center",
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
  systemContainer: {
    width: 335,
    height: 106,
    backgroundColor: "#131313",
    alignSelf: "center",
    padding: 10,
    borderRadius: 5,
    marginTop: 17,
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
