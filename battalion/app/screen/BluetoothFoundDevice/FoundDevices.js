import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CarthagosButton from "../../component/CarthagosButton";
import colors from "../config/Colors/colors";

const FoundDevices = ({ navigation }) => {
  const [clicks, setClicks] = useState([false, false]);

  const handlePress = (index) => {
    setClicks((prevClicks) => {
      const newClicks = prevClicks.map((click, i) => i === index);
      return newClicks;
    });
  };
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/Groupcircle.png")}
        style={styles.background}
      >
        <View style={styles.containerSmall}>
          <Text style={styles.txtFirst}>Found devices</Text>

          <TouchableOpacity
            onPress={() => handlePress(0)}
            style={styles.deviceInfo}
          >
            <Image
              source={require("../../assets/product.png")}
              style={{ width: 71, height: 60 }}
            />
            <View style={{ flexDirection: "column", marginLeft: 20 }}>
              <Text style={styles.batTxt}>Battalion Device #23584</Text>
            </View>
            {clicks[0] ? (
              <MaterialCommunityIcons
                style={{ marginLeft: 50 }}
                name="check-circle"
                color="white"
                size={20}
              />
            ) : null}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handlePress(1)}
            style={styles.deviceInfo}
          >
            <Image
              source={require("../../assets/product.png")}
              style={{ width: 71, height: 60 }}
            />
            <View style={{ flexDirection: "column", marginLeft: 20 }}>
              <Text style={styles.batTxt}>Battalion Device #23584</Text>
            </View>
            {clicks[1] ? (
              <MaterialCommunityIcons
                style={{ marginLeft: 50 }}
                name="check-circle"
                color="white"
                size={20}
              />
            ) : null}
          </TouchableOpacity>
        </View>

        <View style={styles.btn}>
          <CarthagosButton title="confirm" textColor="white" width={277} />
        </View>
      </ImageBackground>
    </View>
  );
};

export default FoundDevices;

const styles = StyleSheet.create({
  background: {
    alignSelf: "center",
    width: 400,
  },
  batTxt: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.white,
    marginBottom: 20,
    maxWidth: 120,
  },
  btn: {
    paddingHorizontal: 20,
    marginTop: 200,
    alignItems: "center",
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  containerSmall: {
    width: "100%",
    marginTop: 63,
    alignItems: "center",
  },
  deviceInfo: {
    width: 315,
    height: 107,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    marginTop: 30,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  txtFirst: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "500",
    textAlign: "center",
    maxWidth: 181,
  },
});
