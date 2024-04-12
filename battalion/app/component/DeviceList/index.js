import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import colors from "../../config/Colors/colors";
import { useAppSettingContext } from "../../context/AppSettingContext/AppSettingContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ChargingProgressCircle from "../ChargingProgressCircle";
import {
  getOwnerAllDevices,
  getUserAllDevices,
} from "../../api/Database/Database";
import { useBleContext } from "../../utils/BLEProvider/BLEProvider";
import { useToast } from "react-native-toast-notifications";

const DeviceList = ({ ownerId, navigation }) => {
  const { getTempValueAndUnit, temp, boxBatteryLevel, isLocked, boxLocked } =
    useAppSettingContext();

  const { connectToDevice, connectedDevice, requestPermissions } =
    useBleContext();
  const [devices, setDevices] = useState([]);
  const [isLoaded, setIsLoaded] = useState(true);
  const [connecting, setConnecting] = useState({ device: null, status: false });
  const toast = useToast();
  function removeDuplicates(array1, array2) {
    const uniqueObjects = [];
    const ids = new Set();

    // Iterate over array1
    array1.forEach((obj) => {
      // Check if the id is not present in array2
      if (!ids.has(obj.id)) {
        // If not present, add the object to uniqueObjects
        uniqueObjects.push(obj);
        // Add this id to the set to prevent duplicates
        ids.add(obj.id);
      }
    });

    // Iterate over array2
    array2.forEach((obj) => {
      // Check if the id is not already present
      if (!ids.has(obj.id)) {
        // If not present, add the object to uniqueObjects
        uniqueObjects.push(obj);
        // Add this id to the set to prevent duplicates
        ids.add(obj.id);
      }
    });

    return uniqueObjects;
  }

  const getDevices = async () => {
    try {
      const ownerArray = await getOwnerAllDevices(ownerId);
      const userArray = await getUserAllDevices(ownerId);

      const combinedArr = removeDuplicates(ownerArray, userArray);

      const newDevices = combinedArr.map((item) => {
        const isCurrentDevice = item.deviceId === connectedDevice?.device?.id;
        return {
          ...item,
          name: item?.name ? item.name : item.deviceId,
          isLocked: isCurrentDevice ? isLocked : false,
          isMain: isCurrentDevice ? true : false,
          isEnabled: true,
          temp: isCurrentDevice ? temp : false,
          batteryLevel: isCurrentDevice ? boxBatteryLevel : false,
        };
      });
      setDevices(newDevices);
      setIsLoaded(false);
    } catch (err) {
      setIsLoaded(false);
      console.log(err);
    }
  };
  useEffect(() => {
    getDevices();
    setConnecting({ device: null, status: false });
    requestPermissions();
  }, []);

  return (
    <View style={styles.Container}>
      {isLoaded && (
        <View>
          <Text style={{ color: "white" }}>Fetching devices</Text>
          <ActivityIndicator size="small" color="#ffffff" />
        </View>
      )}
      <ScrollView style={{ width: "100%" }}>
        {devices.map((item, index) => (
          <TouchableOpacity
            onPress={async () => {
              if (item.deviceId === connectedDevice?.device?.id) {
                return navigation.navigate("Home");
              }
              if (!connecting.status) {
                if (item.deviceId !== connectedDevice?.device?.id) {
                  setConnecting({ device: item.deviceId, status: true });
                  try {
                    await connectToDevice({ id: item.deviceId });
                    return navigation.navigate("Home");
                  } catch (err) {
                    console.log("connecting to the device err:", err);
                    setConnecting({ device: null, status: false });
                    toast.show("Failed to connect to the device");
                  }
                }
              }
            }}
            style={[
              styles.DeviceInfoWrapper,
              { marginTop: index > 0 ? 15 : 0, position: "relative" },
            ]}
            key={item.id}
          >
            <View style={styles.Section}>
              <View style={styles.IconTxtWrapper}>
                <Image
                  source={require("../../assets/product.png")}
                  style={{ width: 30, height: 25 }}
                />
                <Text style={styles.DeviceInformation}>
                  {item.name}{" "}
                  {item.deviceId === connectedDevice?.device?.id &&
                    "(Connected)"}
                </Text>
                {connecting.device === item.deviceId &&
                  connectedDevice.connecting && (
                    <ActivityIndicator size="small" color="#ffffff" />
                  )}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",

                  width: "100%",
                  paddingTop: 14,
                  paddingBottom: 14,
                }}
              >
                <View
                  style={[
                    styles.Wrapper,
                    { opacity: item.isEnabled ? 1 : 0.5 },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="thermometer-bluetooth"
                    size={32}
                    color={colors.icon}
                  />
                  <Text style={styles.Degree}>
                    {item.temp
                      ? getTempValueAndUnit({
                          value: item.temp.value,
                          unit: item.temp.unit,
                        })
                      : `--${temp.unit === "c" ? "℃" : "°F"}`}
                  </Text>
                </View>
                <View
                  style={[
                    styles.Wrapper,
                    { opacity: item.isEnabled ? 1 : 0.5 },
                  ]}
                >
                  <ChargingProgressCircle
                    percents={item?.batteryLevel ? item.batteryLevel : 0}
                    circleRadius={10}
                    strokeWidth={3}
                  />
                  <Text style={styles.BatteryAndPercents}>
                    {item?.batteryLevel ? item.batteryLevel : "--"}%
                  </Text>
                </View>
                <View
                  style={[
                    styles.Wrapper,
                    { opacity: item.isEnabled ? 1 : 0.5 },
                  ]}
                >
                  <Text style={styles.lockedTxt}>
                    Device{"\n"}
                    {item.isLocked ? "Locked" : "Unlocked"}
                  </Text>
                  <View style={styles.IconWrapper}>
                    {item.isLocked ? (
                      <MaterialCommunityIcons
                        name="lock"
                        size={20}
                        color="#B0B0B0"
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="lock-open"
                        size={20}
                        color="white"
                      />
                    )}
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default DeviceList;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    paddingBottom: 100,
    width: "100%",
  },
  DeviceInfoWrapper: {
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 5,
    width: "100%",
  },
  Section: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 121,
    backgroundColor: "#131313",
    padding: 14,
    borderRadius: 5,
  },
  IconTxtWrapper: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
  },
  DeviceInformation: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.white,
    paddingRight: 14,
  },
  Wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "32%",
    height: 55,
    backgroundColor: "#1b1b1b",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 5,
  },
  Degree: {
    fontWeight: "900",
    fontSize: 28,
    color: colors.white,
  },
  BatteryAndPercents: {
    fontWeight: "900",
    fontSize: 22,
    marginLeft: 5,
    color: colors.white,
  },
  lockedTxt: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  IconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#282828",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
  },
  disabledDevice: {
    backgroundColor: "#777",
  },
});
