import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../authentication/Firebase";
import CarButton from "../component/CarButton";
import writeUserData from "../authentication/Database";

const HomeScreen = ({ navigation }) => {
  const [barcode, setBarcode] = useState("");
  const [model, setModel] = useState("");
  const [user, setUser] = useState("");
  /*  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState(""); */

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => console.log(error));
  };

  const handleSaveData = () => {
    writeUserData(barcode, model, user)
      .then(() => {
        /*  setSuccessMsg(successMessage); */
        setBarcode("");
        setModel("");
        setUser("");
      })
      .catch((error) => {
        /*   setErrorMsg(errorMessage); */
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textEmail}>Email: {auth.currentUser?.email}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Barcode"
        value={barcode}
        onChangeText={setBarcode}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Model"
        value={model}
        onChangeText={setModel}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter User"
        value={user}
        onChangeText={setUser}
      />

      {/* {successMsg ? (
        <Text style={styles.successMessage}>{successMsg}</Text>
      ) : null} */}

      {/*  {errorMsg ? <Text style={styles.errorMessage}>{errorMsg}</Text> : null}
       */}
      <TouchableOpacity style={styles.button} onPress={handleSaveData}>
        <Text style={styles.buttonText}>Save Data</Text>
      </TouchableOpacity>

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
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "blue",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  successMessage: {
    color: "green",
    marginTop: 10,
  },
  errorMessage: {
    color: "red",
    marginTop: 10,
  },
});
