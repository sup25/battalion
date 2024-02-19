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
import {
  aproveUser,
  disconnectUser,
  getDeviceUsers,
  rejectUser,
} from "../../api/Database/Database";
import { useBleContext } from "../../utils/BLEProvider/BLEProvider";
import { Toast } from "react-native-toast-notifications";

const ProfileScreen = ({ navigation }) => {
  const { currentUser, logout } = useAuth();
  const userData = FetchUserProfile(currentUser);
  const [phoneNumber, setPhoneNumber] = useState();
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const { connectedDevice } = useBleContext();

  const [updatedUserName, setUpdatedUserName] = useState();

  const [userEmail, setUserEmail] = useState();

  const [userProfileData, setUserProfileData] = useState();
  const [users, setUsers] = useState([]);

  const fetchDeviceUsers = async () => {
    try {
      const deviceUsers = await getDeviceUsers(connectedDevice?.device?.id);
      setUsers(deviceUsers);
    } catch (error) {
      Toast.show("Error fetching device users");
      console.error("Error fetching device users:", error);
    }
  };

  useEffect(() => {
    fetchDeviceUsers();
  }, []);
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
        {connectedDevice?.isOwner && (
          <View style={{ width: "100%" }}>
            <View style={styles.deviceTxtContainer}>
              <Text style={styles.deviceCntd}>Users Connected</Text>
            </View>
            <View
              style={{
                ...styles.connectedInfoContainer,

                justifyContent: users.length > 0 ? "flex-start" : "center",
                alignItems: users.length > 0 ? "flex-start" : "center",
              }}
            >
              {users.length > 0 ? (
                users.map((user, index) => {
                  return (
                    <ScrollView
                      key={user.id}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <View
                        key={user.id}
                        style={{
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <Text
                          key={user.id}
                          style={{
                            ...styles.listText,
                          }}
                        >
                          {user.name}
                        </Text>
                        <View>
                          {user.approved ? (
                            <TouchableOpacity
                              onPress={async () => {
                                try {
                                  await disconnectUser(
                                    connectedDevice?.device?.id,
                                    currentUser?.uid
                                  );
                                  await fetchDeviceUsers();
                                } catch (err) {
                                  console.log(err);
                                }
                              }}
                            >
                              <Text style={styles.listText}>Disconnect</Text>
                            </TouchableOpacity>
                          ) : (
                            <View>
                              {user?.status === "rejected" ? (
                                <Text style={styles.listText}>Rejected</Text>
                              ) : (
                                <View
                                  style={{
                                    justifyContent: "space-between",
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: 15,
                                  }}
                                >
                                  <TouchableOpacity
                                    style={styles.btn}
                                    onPress={async () => {
                                      try {
                                        await aproveUser(
                                          connectedDevice?.device?.id,
                                          currentUser?.uid
                                        );
                                        await fetchDeviceUsers();
                                      } catch (err) {
                                        //test
                                        console.log(err);
                                      }
                                    }}
                                  >
                                    <Text style={styles.listText}>Accept</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    style={styles.btn}
                                    onPress={async () => {
                                      try {
                                        await rejectUser(
                                          connectedDevice?.device?.id,
                                          currentUser?.uid
                                        );
                                        await fetchDeviceUsers();
                                      } catch (err) {
                                        //test
                                        console.log(err);
                                      }
                                    }}
                                  >
                                    <Text style={styles.listText}>Reject</Text>
                                  </TouchableOpacity>
                                </View>
                              )}
                            </View>
                          )}
                        </View>
                      </View>
                      {index < users.length - 1 ||
                        (index === 0 && (
                          <View
                            style={{
                              width: "100%",
                              height: 1,
                              marginTop: 10,
                              marginBottom: 10,
                              backgroundColor: "rgba(255,255,255,0.3)",
                            }}
                          />
                        ))}
                    </ScrollView>
                  );
                })
              ) : (
                <Text style={styles.nodeviceTxt}>No users connected</Text>
              )}
            </View>
          </View>
        )}

        <View style={styles.ForgetPasswordBox}>
          <View style={styles.resetPasswordBox}>
            <Text style={styles.resetPasswordTxt}>reset{"\n"}Password</Text>
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
    width: "100%",
    height: 150,
    backgroundColor: colors.soft,
    marginTop: 13,
    marginBottom: 19,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
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
  btn: {
    backgroundColor: colors.primary,
    paddingBottom: 5,
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 100,
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
    width: 100,
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
  listText: {
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
