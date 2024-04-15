import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import colors from "../../config/Colors/colors";
import CarthagosButton from "../../component/CarthagosButton/CarthagosButton";
import { AddUserData } from "../../api/Database/Database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../utils/AuthProvider/AuthProvider";
import { useToast } from "react-native-toast-notifications";
import { FontsLoad } from "../../utils/FontsLoad";

const AddDevice = ({ navigation }) => {
  const { currentUser } = useAuth();
  const combinedSerialNumRef = useRef("");
  const toast = useToast();
  const [userData, setUserData] = useState({
    combinedSerialNum: "",
  });
  useEffect(() => {
    FontsLoad();
  }, []);

  const handleConfirm = async (setIsLoading) => {
    setIsLoading(true);
    try {
      const { combinedSerialNum } = userData;

      // Validate the combinedSerialNum field
      if (!combinedSerialNum || combinedSerialNum.length !== 12) {
        toast.show("Invalid serial number. Please enter a 12-digit value.", {
          type: "normal",
        });

        setIsLoading(false);
        return;
      }

      // Determine if the combinedSerialNum contains letters or numbers
      const isLetters = /^[A-Za-z]+$/.test(combinedSerialNum);
      const isNumbers = /^[0-9]+$/.test(combinedSerialNum);

      // Set the owner and users values in userData
      const updatedUserData = {
        ...userData,
        owner: currentUser.uid,
        users: [],
        fourDigitCode: "",
        teamType: isLetters ? "Team A" : isNumbers ? "Team B" : "Uncategorized",
      };

      // Call AddUserData to send combinedSerialNum
      try {
        const isOwner = await AddUserData(updatedUserData);

        toast.show("Data saved successfully!", {
          type: "normal",
        });

        // Clear the text input field
        setUserData({
          combinedSerialNum: "",
        });
        handleNavigation(isOwner);
      } catch (error) {
        setIsLoading(false);
        toast.show(error.message, {
          type: "normal",
        });
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleNavigation = async (isOwner) => {
    const combinedSerialNum = combinedSerialNumRef.current;
    if (!combinedSerialNum || combinedSerialNum.length !== 12) {
      console.log("Invalid combinedSerialNum:", combinedSerialNum);
      return;
    }
    await AsyncStorage.setItem("combinedSerialNum", combinedSerialNum);
    console.log("Entered combined serial number:", combinedSerialNum);

    if (isOwner) {
      navigation.navigate("searchscreen", {
        isFirstTime: true,
        serialNum: combinedSerialNum,
      });
    } else {
      navigation.navigate("home");
    }
  };

  const handleChangeText = (key, value) => {
    // Update the combinedSerialNumRef with the current value
    combinedSerialNumRef.current = value;

    setUserData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerSmall}>
        <Text style={styles.txtFirst}>Insert Code Manually</Text>
        <Text style={styles.txtSecond}>Write in the field below</Text>
        <TextInput
          style={styles.txtInput}
          value={userData.combinedSerialNum}
          onChangeText={(value) => handleChangeText("combinedSerialNum", value)}
        />
      </View>

      <View style={styles.btn}>
        <CarthagosButton
          title="confirm"
          width={277}
          textColor={colors.white}
          onPress={(setIsLoading) => handleConfirm(setIsLoading)}
        />
      </View>
    </View>
  );
};

export default AddDevice;

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 15,
    marginTop: 337,
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.black,
    paddingHorizontal: 15,
  },
  containerSmall: {
    width: "100%",
    marginTop: 76,
  },
  InserCodetxt: {
    color: colors.medium,
    fontSize: 14,
    fontWeight: "500",
    alignItems: "center",
  },
  txtInput: {
    width: 283,
    backgroundColor: "#1E1E1E",
    color: colors.white,
    borderRadius: 5,
    height: 55,
    alignSelf: "center",
    marginTop: 31,
    padding: 10,
    fontFamily: "SF-Pro-Display",
    fontSize: 16,
  },
  txtFirst: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "500",
    textAlign: "center",
    fontFamily: "SF-Pro-Display",
  },
  txtSecond: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 8,
    fontFamily: "SF-Pro-Display",
  },
  message: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "normal",
    textAlign: "left",
    marginTop: 10,
  },
});
