import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from "react-native";

import { useAuth } from "../../utils/AuthProvider/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../../config/Colors/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import FetchUserProfile from "../../Hooks/UserProfile/UserProfile";
import CarthagosButton from "../../component/CarthagosButton/CarthagosButton";

const ProfileScreen = ({ navigation }) => {
  const { currentUser, logout } = useAuth();
  const userData = FetchUserProfile(currentUser);
  const [phoneNumber, setPhoneNumber] = useState();
  const [isEditingUsername, setIsEditingUsername] = useState(false);

  const [updatedUserName, setUpdatedUserName] = useState();

  const [userEmail, setUserEmail] = useState();

  const [userProfileData, setUserProfileData] = useState();

  useEffect(() => {
    if (userData) {
      setUserProfileData(userData);
      setUpdatedUserName(userData?.name || "");
      setUserEmail(userData?.email);
      setPhoneNumber(userData?.phoneNumber);
    }
  }, [userData]);

  const handleUsernameEdit = () => {
    setIsEditingUsername(!isEditingUsername);
  };
  if (userData === null) {
    return <Text>Loading...</Text>;
  }

  //update the displayName
  const handleUpdateUserName = () => {
    if (currentUser && userProfileData) {
      // Make sure updatedUserName is not empty
      if (!updatedUserName.trim()) {
        console.log("Username cannot be empty");
        return;
      }

      // Update the user profile data
      const updatedUserData = {
        ...userProfileData,
        name: updatedUserName,
      };

      // Update the display name in the state
      setUpdatedUserName(updatedUserName);

      AsyncStorage.setItem("userProfileData", JSON.stringify(updatedUserData))
        .then(() => {
          console.log("User profile data updated successfully in AsyncStorage");
          setIsEditingUsername(false);
        })
        .catch((error) => {
          console.error(
            "Error updating user profile data in AsyncStorage:",
            error
          );
        });

      // Update the user profile data in Firestore
      const userDocRef = firestore().doc(`users/${currentUser.uid}`);
      userDocRef
        .set(updatedUserData, { merge: true })
        .then(() => {
          console.log("User profile data updated successfully");
          setIsEditingUsername(false);
        })
        .catch((error) => {
          console.error("Error updating user profile data:", error);
        });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={styles.wrapper}>
        <Text style={styles.profileTxt}>My profile</Text>
        <View style={styles.bigRectangle}>
          <View>
            <Text style={styles.userName}>UserName</Text>
            {isEditingUsername ? (
              <TextInput
                style={styles.inputs}
                value={updatedUserName}
                onChangeText={setUpdatedUserName}
              />
            ) : (
              <Text style={styles.inputs}>{updatedUserName}</Text>
            )}
            {isEditingUsername ? (
              <MaterialCommunityIcons
                name="check"
                color="#5A5A5A"
                size={30}
                style={styles.icon}
                onPress={handleUpdateUserName}
              />
            ) : (
              <MaterialCommunityIcons
                name="pencil"
                color="#5A5A5A"
                size={30}
                style={styles.icon}
                onPress={handleUsernameEdit}
              />
            )}
          </View>

          <View>
            <Text style={styles.email}>Email</Text>
            <TextInput
              style={styles.inputs}
              placeholder=""
              placeholderTextColor="white"
              value={userEmail}
              editable={false}
              selectTextOnFocus={false}
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

        <View style={styles.ForgetPasswordBox}>
          <View style={styles.resetPasswordBox}>
            <Text style={styles.resetPasswordTxt}>reset Password</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("forgotpasswordprivate");
            }}
            style={styles.forgotpasswordTxtIcon}
          >
            <Text style={styles.forgetText}>Forgot the Password?</Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={30}
              color="white"
            />
          </TouchableOpacity>
        </View>
        <View style={{ paddingTop: 10, paddingBottom: 10 }}>
          <CarthagosButton
            width={277}
            textColor="white"
            onPress={() => {
              logout();
            }}
            title="logout"
          />
        </View>
        <StatusBar backgroundColor={colors.black} barStyle="light-content" />
      </SafeAreaView>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  addDevice: {
    backgroundColor: colors.primary,
    color: colors.white,
    fontWeight: "500",
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
    fontWeight: "500",
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
    fontWeight: "500",
    color: colors.white,
  },
  ForgetPasswordBox: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#2626266E",
    width: 337,
    height: 95,
    justifyContent: "space-between",
    padding: 18,
  },
  forgetText: {
    color: colors.white,
    width: 80,
    fontSize: 18,
    fontWeight: "500",
  },
  forgotpasswordTxtIcon: {
    backgroundColor: colors.primary,
    padding: 5,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 138,
  },
  inputs: {
    backgroundColor: "#1B1B1B",
    width: 307,
    height: 37,
    borderRadius: 5,
    fontSize: 16,
    padding: 10,
    color: colors.white,
    justifyContent: "center",
  },
  icon: {
    position: "absolute",
    right: 20,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  nodeviceTxt: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.white,
  },
  notfoundIcon: {
    backgroundColor: colors.medium,
    borderRadius: 50,
    padding: 5,
  },
  phoneNumber: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.white,
  },
  profileTxt: {
    color: colors.white,
    fontSize: 32,
    fontWeight: "900",
    textTransform: "uppercase",
    alignSelf: "flex-start",
  },
  resetPasswordBox: {
    width: 126,
  },
  resetPasswordTxt: {
    fontSize: 24,
    textTransform: "uppercase",
    fontWeight: "800",
    color: colors.white,
    width: 126,
  },

  userName: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.white,
  },
  wrapper: {
    marginTop: 55,
    alignItems: "center",
    paddingHorizontal: 15,
  },
});
