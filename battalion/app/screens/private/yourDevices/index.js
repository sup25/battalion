import { StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";
import React, { useEffect } from "react";
import colors from "../../../config/Colors";
import { useAuth } from "../../../context/AuthProvider";
import DeviceList from "../../../components/DeviceList";
import { FontsLoad } from "../../../utils/FontsLoad";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const YourDevices = ({ navigation }) => {
  const { currentUser } = useAuth();

  useEffect(() => {
    FontsLoad();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flex: 1,
            alignItems: "center",
          }}
        >
          <View style={{ width: 24 }}>
            <TouchableWithoutFeedback onPress={() => navigation.goBack(null)}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color="#B0B0B0"
              />
            </TouchableWithoutFeedback>
          </View>
          <Text style={styles.textWelcome}>Your devices</Text>
        </View>
      </View>
      <View style={styles.deviceContainer}>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.connDevice}>Devices Connected</Text>
          <View style={styles.addDevice}>
            <Text
              style={{ color: colors.white }}
              onPress={() => {
                navigation.navigate("addDevice");
              }}
            >
              Add Device +
            </Text>
          </View>
        </View>
      </View>
      <DeviceList navigation={navigation} ownerId={currentUser.uid} />
    </View>
  );
};

export default YourDevices;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  wrapper: {
    paddingHorizontal: 15,
    width: "100%",
    marginTop: 55,
    borderBottomColor: colors.white,
    borderBottomWidth: 1,
    paddingBottom: 10,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  section: {
    flexDirection: "column",
    paddingTop: 35,
  },
  textWelcome: {
    fontSize: 26,
    letterSpacing: -1,
    textTransform: "uppercase",
    color: colors.white,
    fontWeight: "800",
    alignItems: "flex-start",
    fontFamily: "Alternate-Gothic-bold",
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
  connDevice: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.white,
    fontFamily: "SF-Pro-Display",
  },
  addDevice: {
    backgroundColor: colors.primary,
    color: colors.white,
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 15,
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "SF-Pro-Display",
  },
});
