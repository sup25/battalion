import React, { useState } from "react";
import colors from "../../config/Colors/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  StatusBar,
  Image,
  ImageBackground,
  TouchableWithoutFeedback,
} from "react-native";

import LocksToggle from "../../component/LocksToggle";
import LightsToggle from "../../component/LightsToggle";
import SetBoxTemp from "../../component/SetBoxTemp";
import BoxTemp from "../../component/BoxTemp";
import BatteryPercent from "../../component/BatteryPercent";
import { useBleContext } from "../../utils/BLEProvider/BLEProvider";

const DeviceDetails = ({ navigation }) => {
  const { disconnectFromDevice } = useBleContext();
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      <ImageBackground
        style={styles.background}
        source={require("../../assets/background.png")}
      >
        <View style={styles.headingContainer}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TouchableWithoutFeedback onPress={() => navigation.goBack(null)}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color="#B0B0B0"
              />
            </TouchableWithoutFeedback>
            <Text style={styles.texHeading}>device details</Text>
          </View>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate("devicesetting")}
          >
            <AntDesign name="setting" size={30} color="#fff" />
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.battalionId}>
          <TextInput
            style={styles.input}
            placeholder="Battalion Device #23456"
            placeholderTextColor="#656565"
          />
          <MaterialCommunityIcons
            name="pencil"
            color="#5A5A5A"
            size={30}
            style={styles.icon}
          />
        </View>
      </ImageBackground>
      <View style={styles.wrapper}>
        <View style={styles.unlockedImageContainer}>
          <Image
            style={styles.productImage}
            source={require("../../assets/devicedetail.png")}
          />
          <View style={{ display: "flex", gap: 25 }}>
            <LocksToggle />
            <LightsToggle />
          </View>
        </View>
        <View style={styles.unlockedTempContainer}>
          <BoxTemp />
          <SetBoxTemp />
        </View>
        <BatteryPercent />
      </View>
      <View>
        <TouchableWithoutFeedback
          style={{ backgroundColor: "white" }}
          onPress={() => disconnectFromDevice()}
        >
          <Text>Disconnect from device</Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default DeviceDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headingContainer: {
    paddingHorizontal: 15,
    width: "100%",
    marginTop: 55,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  texHeading: {
    fontSize: 32,
    fontWeight: "800",
    textTransform: "uppercase",
    color: colors.white,
    fontWeight: "900",
    marginLeft: 10,
    alignItems: "flex-start",
  },

  battalionId: {
    paddingHorizontal: 15,
    alignSelf: "center",
    backgroundColor: "#000000a8",
    width: "100%",
  },

  input: {
    width: 311,
    height: 40,
    marginVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#1B1B1B",
  },

  icon: {
    position: "absolute",
    right: 50,
    top: "50%",
    transform: [{ translateY: -15 }],
  },

  wrapper: {
    backgroundColor: colors.black,
    paddingHorizontal: 15,
    height: "100%",
  },

  unlockedImageContainer: {
    backgroundColor: "#131313",
    paddingVertical: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },

  productImage: {
    width: 87,
    height: 74,
    opacity: 0.5,
  },

  unlockedTempContainer: {
    paddingVertical: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
