import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { auth } from "../authentication/Firebase";
import CarButton from "../component/CarButton";
const HomeScreen = ({ navigation }) => {
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => console.log(error));
  };
  return (
    <View style={styles.container}>
      <Text style={styles.textEmail}>Email:{auth.currentUser?.email}</Text>

      <CarButton title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  textEmail: {
    fontSize: 24,
    fontWeight: "800",
  },
});
