import React from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { useAuth } from "../navigation/AuthNavigator";
import CarthagosButton from "../component/CarthagosButton";
import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ProfileScreen = ({ navigation }) => {
  const { logout, currentUser } = useAuth();
  const userEmail = currentUser?.email;
  const userName = userEmail ? userEmail.split("@")[0] : "";
  const phoneNumber = currentUser?.phoneNumber;

  const handleLogout = () => {
    logout();
    /*   .then(() => {
      navigation.navigate("Main");
    }); */
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.profileTxt}>My profile</Text>
        <View style={styles.bigRectangle}>
          <View>
            <Text style={styles.userName}>UserName</Text>
            <TextInput
              style={styles.inputs}
              placeholder=""
              placeholderTextColor="white"
              value={userName}
            />
            <MaterialCommunityIcons
              name="pencil"
              color="#5A5A5A"
              size={30}
              style={styles.icon}
            />
          </View>
          <View>
            <Text style={styles.email}>Email</Text>
            <TextInput
              style={styles.inputs}
              placeholder=""
              placeholderTextColor="white"
              value={userEmail}
            />
            <MaterialCommunityIcons
              name="pencil"
              color="#5A5A5A"
              size={30}
              style={styles.icon}
            />
          </View>
          <View>
            <Text style={styles.phoneNumber}>Phone Number</Text>
            <TextInput
              style={styles.inputs}
              placeholder="+10000"
              placeholderTextColor="white"
              value={phoneNumber}
            />
            <MaterialCommunityIcons
              name="pencil"
              color="#5A5A5A"
              size={30}
              style={styles.icon}
            />
          </View>
        </View>
        <View style={styles.deviceTxtContainer}>
          <Text style={styles.deviceCntd}>Devices Connected</Text>
          <Text style={styles.addDevice}>Add Device +</Text>
        </View>
        <View style={styles.connectedInfoContainer}>
          <MaterialCommunityIcons
            style={styles.notfoundIcon}
            name="cube"
            size={30}
            color="white"
          />
          <Text style={styles.nodeviceTxt}>No devices connected</Text>
        </View>
        <CarthagosButton
          title="Logout"
          textColor="white"
          width={277}
          onPress={handleLogout}
        />
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  addDevice: {
    backgroundColor: colors.primary,
    color: colors.white,
    fontWeight: 500,
    fontSize: 14,
    borderRadius: 20,
    padding: 10,
  },
  bigRectangle: {
    width: 335,
    height: 239,
    backgroundColor: colors.soft,
    paddingHorizontal: 13,
    paddingVertical: 12,
    justifyContent: "space-between",
  },

  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  connectedInfoContainer: {
    width: 335,
    height: 141,
    backgroundColor: colors.soft,
    marginTop: 13,
    marginBottom: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  deviceCntd: {
    fontSize: 15,
    fontWeight: 500,
    color: colors.white,
  },
  deviceTxtContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 335,
    marginTop: 27,
  },
  email: {
    fontSize: 14,
    fontWeight: 500,
    color: colors.white,
  },
  inputs: {
    backgroundColor: "#1B1B1B",
    width: 307,
    height: 37,
    borderRadius: 5,
    fontSize: 16,
    padding: 10,
    color: colors.white,
  },
  icon: {
    position: "absolute",
    right: 20,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  nodeviceTxt: {
    fontSize: 14,
    fontWeight: 500,
    color: colors.white,
  },
  notfoundIcon: {
    backgroundColor: colors.medium,
    borderRadius: 50,
    padding: 5,
  },
  phoneNumber: {
    fontSize: 14,
    fontWeight: 500,
    color: colors.white,
  },
  profileTxt: {
    color: colors.white,
    fontSize: 32,
    fontWeight: 900,
    textTransform: "uppercase",
    alignSelf: "flex-start",
  },

  userName: {
    fontSize: 14,
    fontWeight: 500,
    color: colors.white,
  },
  wrapper: {
    marginTop: 37,
    alignItems: "center",
    paddingHorizontal: 20,
  },
});
