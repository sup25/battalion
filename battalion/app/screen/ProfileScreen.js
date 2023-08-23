import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { updateProfile } from "firebase/auth";

import { useAuth } from "../utils/AuthProvider";
import * as LocalAuthentication from "expo-local-authentication";
import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ProfileScreen = ({ navigation }) => {
  const { currentUser } = useAuth();

  const userEmail = currentUser?.email;

  const phoneNumber = currentUser?.phoneNumber;
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);

  const [updatedUserName, setUpdatedUserName] = useState(
    currentUser?.displayName || ""
  );
  const handleEmailChange = async () => {
    if (!isEditingEmail) {
      try {
        const hasBiometricHardware =
          await LocalAuthentication.hasHardwareAsync();

        if (hasBiometricHardware) {
          const isBiometricEnrolled =
            await LocalAuthentication.isEnrolledAsync();

          if (isBiometricEnrolled) {
            const biometricResult = await LocalAuthentication.authenticateAsync(
              {
                promptMessage: "Authenticate to change email",
              }
            );

            if (biometricResult.success) {
              // User successfully authenticated using biometrics
              setIsEditingEmail(true); // Enable email editing
              setIsChangingEmail(true); // Also enable onFocus effect
            } else {
              // Biometric authentication failed
              console.log("Biometric authentication failed");
            }
          } else {
            // Biometric not enrolled
            console.log("Biometric not enrolled");
          }
        } else {
          // Biometric hardware not available
          console.log("Biometric hardware not available");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleUsernameEdit = () => {
    setIsEditingUsername(!isEditingUsername);
  };

  const handleSaveUserName = async () => {
    try {
      if (!currentUser) {
        console.log("User is not available");
        return;
      }

      const newUserName = updatedUserName.trim();

      if (newUserName === "") {
        console.log("Username cannot be empty");
        return;
      }

      console.log("Before update:", currentUser.displayName);

      await updateProfile(currentUser, {
        displayName: newUserName,
      });

      console.log("After update:", currentUser.displayName);

      console.log("Profile update successful");
      setIsEditingUsername(false);
    } catch (error) {
      console.log("Error updating username:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
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
                onPress={handleSaveUserName}
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

          <TouchableWithoutFeedback onPress={handleEmailChange}>
            <View>
              <Text style={styles.email}>Email</Text>
              <TextInput
                style={[
                  styles.inputs,
                  {
                    backgroundColor: isEditingEmail ? "#1B1B1B" : "transparent",
                  },
                ]}
                placeholder=""
                placeholderTextColor="white"
                value={userEmail}
                editable={isEditingEmail}
                onFocus={() => setIsChangingEmail(true)}
                onBlur={() => setIsChangingEmail(false)}
              />
              <MaterialCommunityIcons
                name="pencil"
                color="#5A5A5A"
                size={30}
                style={styles.icon}
                onPress={handleEmailChange}
              />
            </View>
          </TouchableWithoutFeedback>
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
    maxWidth: 80,
    fontSize: 18,
    fontWeight: 500,
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
  resetPasswordBox: {
    width: 126,
  },
  resetPasswordTxt: {
    fontSize: 24,
    textTransform: "uppercase",
    fontWeight: 800,
    color: colors.white,
    maxWidth: 80,
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
