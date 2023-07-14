import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { auth } from "../authentication/Firebase";
import CarButton from "../component/CarButton";
import colors from "../config/colors";

const ProfileScreen = () => {
  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        console.log("Successfully logged out");
      })
      .catch((error) => console.log(error));
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoutContainer}>
        <Text style={styles.profileTxt}>Profile text</Text>
        <CarButton
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
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  logoutContainer: {
    marginTop: 100,
    alignItems: "center",
  },
  profileTxt: {
    color: colors.white,
    fontSize: 20,
  },
});
