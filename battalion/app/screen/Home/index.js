import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import colors from "../../config/Colors/colors";
import { useBleContext } from "../../utils/BLEProvider/BLEProvider";
import { useAuth } from "../../utils/AuthProvider/AuthProvider";
import FetchUserProfile from "../../Hooks/UserProfile/UserProfile";
import DeviceList from "../../component/DeviceList";
import { FontsLoad } from "../../utils/FontsLoad";

const Home = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { connectedDevice } = useBleContext();
  const [userName, setUserName] = useState();
  const userData = FetchUserProfile(currentUser);
  useEffect(() => {
    FontsLoad();
  }, []);

  useEffect(() => {
    if (userData) {
      setUserName(userData?.name || "");
    }
  }, [userData]);

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.textWelcome}>Your devices</Text>
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
          <Text
            style={styles.addDevice}
            onPress={() => {
              navigation.navigate("addDevice");
            }}
          >
            Add Device +
          </Text>
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
    fontSize: 28,
    fontWeight: "800",
    textTransform: "uppercase",
    color: colors.white,
    fontWeight: "900",
    alignItems: "flex-start",
    fontFamily: "Alternate-Gothic",
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
