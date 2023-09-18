import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

import { updateProfile, updateEmail } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../utils/AuthProvider";
import * as LocalAuthentication from "expo-local-authentication";
import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ProfileScreen = ({ navigation }) => {
  const { currentUser } = useAuth();

  const phoneNumber = currentUser?.phoneNumber;
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);

  const [updatedUserName, setUpdatedUserName] = useState(
    currentUser?.displayName || ""
  );

  const [updatedEmail, setUpdatedEmail] = useState(currentUser?.email || "");

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("currentUser");
        if (storedUserData) {
          const parsedUser = JSON.parse(storedUserData);
          // Update state with email and display name
          setUpdatedEmail(parsedUser.email || "");
          setUpdatedUserName(parsedUser.displayName || "");
        }
      } catch (error) {
        console.error("Error loading data from AsyncStorage:", error);
      }
    };

    loadData();
  }, []);

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

  //saving the displayName
  const handleSaveUserName = async () => {
    try {
      if (!currentUser) {
        console.log("User is not available");
        return;
      }

      const newUserName = updatedUserName.trim();
      console.log("Updated User Name:", newUserName);

      if (newUserName === "") {
        console.log("Username cannot be empty");
        return;
      }

      // Set the display name directly on the currentUser object
      currentUser.displayName = newUserName;

      // Now, check the authentication provider and update if needed
      const passwordProvider = currentUser.providerData.find(
        (provider) => provider.providerId === "password"
      );
      console.log("Provider Data:", currentUser.providerData);
      console.log("Provider ID:", passwordProvider);

      if (passwordProvider && passwordProvider.providerId === "password") {
        console.log("User is authenticated with email/password ");

        // Update the display name directly for the "password" provider
        passwordProvider.displayName = newUserName;

        try {
          // Update the display name for the "password" provider
          await updateProfile(currentUser, { displayName: newUserName });
          // Save the updated user data in AsyncStorage
          await AsyncStorage.setItem(
            "currentUser",
            JSON.stringify(currentUser)
          );

          console.log("Profile update successful for password provider");
        } catch (error) {
          console.log("Error updating username for password provider:", error);
        }
      }

      const phoneProvider = currentUser.providerData.find(
        (provider) => provider.providerId === "phone"
      );

      if (phoneProvider && phoneProvider.providerId === "phone") {
        console.log("User is authenticated with phone");

        console.log("Profile update successful for phone provider");
      }

      console.log("Updated Display Name:", currentUser.displayName);

      console.log("Provider ID:", passwordProvider);
      console.log("Provider ID:", phoneProvider);

      setIsEditingUsername(false);
    } catch (error) {
      console.log("Error updating username:", error);
    }
  };

  //saving the email
  const handleSaveEmail = async () => {
    try {
      if (!currentUser) {
        console.log("User is not available");
        return;
      }

      console.log("providerdata", currentUser.providerData);

      const newEmail = updatedEmail.trim();
      console.log("Updated Email:", newEmail);

      if (newEmail === "") {
        console.log("Email cannot be empty");
        return;
      }

      // Find the providerData object with providerId "password"
      const passwordProvider = currentUser.providerData.find(
        (provider) => provider.providerId === "password"
      );

      if (passwordProvider) {
        // Update the email and uid properties of the "password" provider
        passwordProvider.email = newEmail;
        passwordProvider.uid = newEmail; //updating userId as well

        // Now, you can log the updated providerData to verify the change
        console.log("Updated providerData:", currentUser.providerData);
      } else {
        console.log("Password provider not found in providerData");
      }

      try {
        // Now update their email
        await updateEmail(currentUser, newEmail);

        // Update the local state with the new email
        setUpdatedEmail(newEmail);
        setIsEditingEmail(false);

        // Store the updated user data in AsyncStorage
        const updatedUser = { ...currentUser, email: newEmail };
        await AsyncStorage.setItem("currentUser", JSON.stringify(updatedUser));

        console.log("Email update successful for the currently signed-in user");
      } catch (error) {
        console.log("Error updating email:", error);
      }
    } catch (error) {
      console.log("Error updating email:", error);
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
                value={updatedEmail}
                editable={isEditingEmail}
                onFocus={() => setIsChangingEmail(true)}
                onBlur={() => setIsChangingEmail(false)}
                onChangeText={setUpdatedEmail}
              />

              {isEditingEmail ? (
                <MaterialCommunityIcons
                  name="check"
                  color="#5A5A5A"
                  size={30}
                  style={styles.icon}
                  onPress={handleSaveEmail}
                />
              ) : (
                <MaterialCommunityIcons
                  name="pencil"
                  color="#5A5A5A"
                  size={30}
                  style={styles.icon}
                  onPress={handleEmailChange}
                />
              )}
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
