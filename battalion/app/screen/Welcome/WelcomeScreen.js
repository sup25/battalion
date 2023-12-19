import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  StatusBar,
  Image,
  ImageBackground,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { useToast } from "react-native-toast-notifications";

import { useAuth } from "../../utils/AuthProvider";
import FetchUserProfile from "../../Hooks/UserProfile";
import colors from "../../config/Colors/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import DeviceLockedUnlockded from "../../component/DeviceLockedUnlocked";
import LightToggle from "../../component/LightToggle";
import BoxTemperature from "../../component/BoxTemperature";
import ActualBoxTemp from "../../component/ActualBoxTemp";
import BatteryPercentText from "../../component/BatteryPercentText";

const WelcomeScreen = ({ navigation }) => {
  const toast = useToast();
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing((prevState) => !prevState);
  };

  const [userName, setUserName] = useState();

  const userData = FetchUserProfile(currentUser);

  useEffect(() => {
    // Set the user's display name from currentUser
    if (userData) {
      setUserName(userData?.name || "");
    }
  }, [userData]);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <ImageBackground
        style={styles.background}
        source={require("../../assets/background.png")}
      >
        <View
          style={{
            paddingHorizontal: 15,
            width: "100%",
            marginTop: 55,
            borderBottomColor: colors.white,
            borderBottomWidth: 1,
            paddingBottom: 10,
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <Text style={styles.textEmail}>Welcome, {userName}</Text>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate("devicesetting")}
          >
            <AntDesign name="setting" size={30} color="#fff" />
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.deviceContainer}>
          <Text style={styles.connDevice}>Devices Connected</Text>
          <Text
            style={styles.addDevice}
            onPress={() => {
              navigation.navigate("searchscreen");
            }}
          >
            Add Device +
          </Text>
        </View>
        <View style={styles.battalionId}>
          <TextInput
            style={styles.input}
            placeholder="Battalion Device #23456"
            placeholderTextColor="#656565"
          />
          {isEditing ? (
            <MaterialCommunityIcons
              name="check"
              color="#5A5A5A"
              size={30}
              style={styles.icon}
            />
          ) : (
            <MaterialCommunityIcons
              name="pencil"
              color="#5A5A5A"
              size={30}
              style={styles.icon}
              onPress={handleEdit}
            />
          )}
        </View>
      </ImageBackground>
      <View style={styles.wrapper}>
        <View style={styles.unlockedImageContainer}>
          <Image
            style={styles.productImage}
            source={require("../../assets/devicedetail.png")}
          />

          <View style={{ display: "flex" }}>
            <DeviceLockedUnlockded />
            <LightToggle />
          </View>
        </View>
        <TouchableOpacity
          style={styles.unlockedTempContainer}
          onPress={() => {
            navigation.navigate("devicedetails");
          }}
        >
          <ActualBoxTemp />
          <BoxTemperature />
        </TouchableOpacity>
        <BatteryPercentText />
      </View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
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
  deviceLocked: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 11,
    alignItems: "center",
  },
  lockedTxt: {
    fontWeight: "500",
    fontSize: 14,
    color: "#B0B0B0",
    paddingRight: 11,
  },

  addDevice: {
    backgroundColor: colors.primary,
    color: colors.white,
    borderRadius: 20,
    alignItems: "center",
    padding: 5,
    fontSize: 14,
    fontWeight: "500",
  },

  battalionId: {
    paddingHorizontal: 15,
    alignSelf: "center",
    backgroundColor: "#000000a8",
    width: "100%",
  },
  button: {
    backgroundColor: "blue",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
  },
  container: {
    flex: 1,
  },
  TemptextIconWrapper: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  connDevice: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.white,
  },
  degree: {
    fontWeight: "800",
    fontSize: 36,
    color: "#5A5A5A",
  },
  deviceContainer: {
    backgroundColor: "#000000a8",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 20,
    alignItems: "center",
    width: "100%",
    marginTop: 21,
  },
  errorMessage: {
    color: "red",
    marginTop: 10,
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
  iconEllipse: {
    width: 34,
    height: 34,
    backgroundColor: "#5A5A5A",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  lockedConatiner: {
    backgroundColor: "#1B1B1B",
    width: 125,
    height: 93,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  lockedTxt: {
    fontWeight: "500",
    fontSize: 14,
    color: "#B0B0B0",
  },

  productImage: {
    width: 87,
    height: 74,
    opacity: 0.5,
  },

  successMessage: {
    color: "green",
    marginTop: 10,
  },
  TempConatinerBg: {
    width: 150,
    height: 159,
    backgroundColor: "#131313",
    borderRadius: 5,
    padding: 10,
    justifyContent: "space-between",
  },
  textEmail: {
    fontSize: 28,
    fontWeight: "800",
    textTransform: "uppercase",
    color: colors.white,
    fontWeight: "900",

    alignItems: "flex-start",
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
  unlockedTempContainer: {
    paddingVertical: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ChargeTxtAndIcon: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  wrapper: {
    backgroundColor: colors.black,
    paddingHorizontal: 15,
    height: "100%",
  },
});
