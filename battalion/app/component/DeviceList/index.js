import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import colors from "../../config/Colors/colors";
import { useAppSettingContext } from "../../context/AppSettingContext/AppSettingContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ChargingProgressCircle from "../ChargingProgressCircle";
import { getOwnerAllDevices } from "../../api/Database/Database";

const DeviceList = ({ ownerId }) => {
  const { getTempValueAndUnit, temp, boxBatteryLevel } = useAppSettingContext();
  const [devices, setDevices] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const getAllOwnerDevice = async () => {
    try {
      let res = await getOwnerAllDevices(ownerId);
      const newDevices = res.map((item) => {
        return {
          ...item,
          name: "testing",
          isLocked: false,
          isMain: false,
          isEnabled: false,
          temp: 5,
          batteryLevel: 50,
        };
      });
      setDevices(newDevices);
      setIsLoaded(true);
    } catch (err) {
      setIsLoaded(true);
      console.log(err);
    }
  };

  useEffect(() => {
    getAllOwnerDevice();
  }, []);
  return (
    <View style={styles.Container}>
      {!isLoaded && <Text style={{ color: "white" }}>Fetching data...</Text>}
      <ScrollView>
        {devices.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.DeviceInfoWrapper,
              { marginTop: index > 0 ? 15 : 0 },
            ]}
          >
            <View style={styles.Section}>
              <View style={styles.IconTxtWrapper}>
                <Image
                  source={require("../../assets/product.png")}
                  style={{ width: 30, height: 25 }}
                />
                <Text style={styles.DeviceInformation}>{item.name}</Text>
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
                    name="thermometer"
                    size={32}
                    color={colors.icon}
                  />
                  <Text style={styles.Degree}>
                    {getTempValueAndUnit({ value: item.temp, unit: temp.unit })}
                  </Text>
                </View>
                <View
                  style={[
                    styles.Wrapper,
                    { opacity: item.isEnabled ? 1 : 0.5 },
                  ]}
                >
                  <Text style={styles.BatteryAndPercents}>
                    {item?.batteryLevel ? item.batteryLevel : "--"}
                  </Text>
                  <ChargingProgressCircle
                    percents={item?.batteryLevel ? item.batteryLevel : 0}
                  />
                </View>
                <View
                  style={[
                    styles.Wrapper,
                    { opacity: item.isEnabled ? 1 : 0.5 },
                  ]}
                >
                  <Text style={styles.lockedTxt}>
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
          </View>
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
  },
  DeviceInfoWrapper: {
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 5,
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
  },
  DeviceInformation: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.white,
    paddingRight: 14,
  },
  Wrapper: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",

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
    fontSize: 28,
    color: colors.white,
  },
  lockedTxt: {
    width: 48,
    color: colors.white,
  },
  IconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#282828",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledDevice: {
    backgroundColor: "#777",
  },
});
