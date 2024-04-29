import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useEffect } from "react";
import colors from "../../config/Colors/colors";
import { useBleContext } from "../../utils/BLEProvider/BLEProvider";
import { useAuth } from "../../utils/AuthProvider/AuthProvider";
import FetchUserProfile from "../../Hooks/UserProfile/UserProfile";
import DeviceList from "../../component/DeviceList";
import { FontsLoad } from "../../utils/FontsLoad";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Home = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { connectedDevice } = useBleContext();
  const [userName, setUserName] = useState();
  const userData = FetchUserProfile(currentUser);
  const loadFont = async () => {
    try {
      const font = await FontsLoad();
      console.log("test///", font);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    loadFont();
  }, []);

  useEffect(() => {
    if (userData) {
      setUserName(userData?.name || "");
    }
  }, [userData]);

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={{ display: "flex",flexDirection:'row',flex:1, alignItems: "center" }}>
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

export default Home;

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
