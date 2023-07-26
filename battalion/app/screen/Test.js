import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import colors from "../config/colors";
import CarButton from "../component/CarButton";
import writeUserData from "../authentication/Database";

const Test = () => {
  const [userData, setUserData] = useState({
    id: "",
    product_code: "",
    model: "",
    serial_number: "",
    specs: "",
    user: "",
  });

  const handleSaveData = () => {
    writeUserData(userData); // Call the writeUserData function with the userData object
    console.log("Saving data:", userData);
  };

  const handleChangeText = (key, value) => {
    setUserData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="ID"
        placeholderTextColor={colors.white}
        value={userData.id}
        onChangeText={(value) => handleChangeText("id", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Product Code"
        placeholderTextColor={colors.white}
        value={userData.product_code}
        onChangeText={(value) => handleChangeText("product_code", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Model"
        placeholderTextColor={colors.white}
        value={userData.model}
        onChangeText={(value) => handleChangeText("model", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Serial Number"
        placeholderTextColor={colors.white}
        value={userData.serial_number}
        onChangeText={(value) => handleChangeText("serial_number", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Specs"
        placeholderTextColor={colors.white}
        value={userData.specs}
        onChangeText={(value) => handleChangeText("specs", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="User"
        placeholderTextColor={colors.white}
        value={userData.user}
        onChangeText={(value) => handleChangeText("user", value)}
      />
      <CarButton
        onPress={handleSaveData}
        title="Save Data"
        width={277}
        textColor="white"
      />
    </View>
  );
};

export default Test;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.black,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: colors.white,
  },
});
