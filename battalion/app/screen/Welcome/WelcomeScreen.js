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

import { useAuth } from "../../utils/AuthProvider/AuthProvider";
import FetchUserProfile from "../../Hooks/UserProfile/UserProfile";
import colors from "../../config/Colors/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import LocksToggle from "../../component/LocksToggle";
import LightsToggle from "../../component/LightsToggle";
import SetBoxTemp from "../../component/SetBoxTemp";
import BoxTemp from "../../component/BoxTemp";
import BatteryPercent from "../../component/BatteryPercent";
import { useBleContext } from "../../utils/BLEProvider/BLEProvider";
import { useToast } from "react-native-toast-notifications";
import { setNameToDevice } from "../../api/Database/Database";
import { useAppSettingContext } from "../../context/AppSettingContext/AppSettingContext";

const WelcomeScreen = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const { boxName, setBoxNameValue } = useAppSettingContext();
  const { connectedDevice, disconnectFromDevice } = useBleContext();
  const [deviceName, setDeviceName] = useState(boxName);

  const toast = useToast();

  const handleSubmitName = async () => {
    console.log("test");
    if (deviceName === "") {
      return toast.show("Please enter a name.");
    }
    try {
      await setNameToDevice(deviceName, connectedDevice?.device?.id);
      setIsEditing((prevState) => !prevState);
      toast.show("Device name updated successfully.");
      setBoxNameValue(deviceName);
    } catch (error) {
      console.log("Error setting name to device", error);
    }
  };
  const handleEdit = async () => {
    setIsEditing((prevState) => !prevState);
  };

  useEffect(() => {
    if (boxName) {
      setDeviceName(boxName);
    }
  }, [boxName]);
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
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate("home")}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color="#B0B0B0"
              />
            </TouchableWithoutFeedback>
            <Text style={styles.textWelcome}>device details</Text>
          </View>
          <TouchableWithoutFeedback
            onPress={() =>
              connectedDevice?.device
                ? navigation.navigate("devicesetting")
                : toast.show("Please connect to a device.", {
                    type: "error",
                  })
            }
          >
            <AntDesign name="setting" size={30} color="#fff" />
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.deviceContainer}>
          {!connectedDevice?.device && (
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.connDevice}>Devices Connected</Text>
              <Text
                style={styles.addDevice}
                onPress={() => {
                  navigation.navigate("searchscreen", { isFirstTime: true });
                }}
              >
                Add Device +
              </Text>
            </View>
          )}
        </View>
        <View style={styles.battalionId}>
          <TextInput
            editable={isEditing}
            onBlur={() => setIsEditing(false)}
            style={styles.input}
            placeholder="Battalion Device name"
            placeholderTextColor="#656565"
            value={deviceName}
            focusable={true}
            onChangeText={(text) => {
              console.log(text);
              setDeviceName(text);
            }}
          />
          {isEditing ? (
            <MaterialCommunityIcons
              name="check"
              color="white"
              size={30}
              style={styles.icon}
              onPress={handleSubmitName}
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
            <LocksToggle />
            <LightsToggle />
          </View>
        </View>
        <View style={styles.unlockedTempContainer}>
          <BoxTemp />
          <SetBoxTemp />
        </View>
        <BatteryPercent />
        {connectedDevice?.device && (
          <View style={styles.btn}>
            <TouchableOpacity
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => disconnectFromDevice()}
            >
              <Text style={{ color: "white", fontSize: 14, fontWeight: "500" }}>
                Disconnect from device
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
  btn: {
    backgroundColor: colors.primary,
    color: colors.white,
    borderRadius: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    height: 30,
    marginTop: 50,
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
    position: "relative",
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
    color: "white",
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
  textWelcome: {
    fontSize: 28,
    fontWeight: "800",
    textTransform: "uppercase",
    color: colors.white,
    fontWeight: "900",
    alignItems: "flex-start",
    marginLeft: 10,
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
