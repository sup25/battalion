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
  RefreshControl,
  ActivityIndicator,
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
import { FontsLoad } from "../../utils/FontsLoad";

const ProfileScreen = (props) => {
  const { currentUser, logout } = useAuth();
  const userData = FetchUserProfile(currentUser);
  const [phoneNumber, setPhoneNumber] = useState();
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const { connectedDevice } = useBleContext();

  const [updatedUserName, setUpdatedUserName] = useState();

  const [userEmail, setUserEmail] = useState();

  const [userProfileData, setUserProfileData] = useState();
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    FontsLoad();
  }, []);

  const fetchDeviceUsers = async () => {
    setRefreshing(true);
    try {
      const deviceUsers = await getDeviceUsers(
        connectedDevice?.device?.serialNum,
        connectedDevice?.isOwner
      );
      setUsers(deviceUsers);
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
      if (error.message === "Device not found") {
        Toast.show(
          "Couldn't get device's users,\nMake sure you are connected to the device"
        );
      } else {
        Toast.show("Error fetching device users");
      }
      console.error("Error fetching device users:", error);
    }
  };

  useEffect(() => {
    if (props.route?.name === "Profile" && props.navigation.isFocused()) {
      fetchDeviceUsers();
    }
  }, [props.navigation.isFocused()]);

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
    <DismissMyKeyboard>
      <View style={styles.container}>
        <SafeAreaView style={styles.wrapper}>
          <Text style={styles.profileTxt}>My profile</Text>
          <View style={styles.bigRectangle}>
            <View>
              <Text style={styles.userName}>Name</Text>
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
                  size={25}
                  style={styles.icon}
                  onPress={handleUpdateUserName}
                />
              ) : (
                <MaterialCommunityIcons
                  name="pencil"
                  color="#5A5A5A"
                  size={25}
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
              <Text style={styles.phoneNumber}>Phone number</Text>
              <TextInput
                style={styles.inputs}
                placeholder="+10000"
                placeholderTextColor="white"
                value={phoneNumber}
                editable={false}
              />
            </View>
          </View>
          {/* <View style={styles.deviceTxtContainer}>
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
        </View> */}
          {connectedDevice?.isOwner && (
            <View style={{ width: "100%" }}>
              <View style={styles.deviceTxtContainer}>
                <Text style={styles.deviceCntd}>Users Connected</Text>
                <View
                  style={{
                    marginLeft: 5,
                    width: 30,
                    height: 30,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {refreshing ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <MaterialCommunityIcons
                      onPress={fetchDeviceUsers}
                      name="refresh"
                      size={25}
                      color="white"
                    />
                  )}
                </View>
              </View>
              <ScrollView
                indicatorStyle="white"
                fadingEdgeLength={100}
                showsVerticalScrollIndicator={true}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={fetchDeviceUsers}
                  />
                }
                style={styles.connectedInfoContainer}
              >
                {users.length > 0 ? (
                  users.map((user, index) => {
                    return (
                      <View key={user.id} style={{ width: "100%", height: 50 }}>
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
                                style={styles.btn}
                                disabled={refreshing}
                                onPress={async () => {
                                  setRefreshing(true);
                                  if (refreshing) return;
                                  try {
                                    await disconnectUser(
                                      connectedDevice?.device?.serialNum,
                                      user.id
                                    );
                                    await fetchDeviceUsers();
                                  } catch (err) {
                                    setRefreshing(false);
                                    console.log(err);
                                  }
                                }}
                              >
                                <Text style={styles.listText}>
                                  Revoke access
                                </Text>
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
                                      disabled={refreshing}
                                      style={styles.btn}
                                      onPress={async () => {
                                        setRefreshing(true);
                                        if (refreshing) return;
                                        try {
                                          await aproveUser(
                                            connectedDevice?.device?.serialNum,
                                            user.id
                                          );
                                          await fetchDeviceUsers();
                                        } catch (err) {
                                          //test
                                          setRefreshing(false);
                                          console.log(err);
                                        }
                                      }}
                                    >
                                      <Text style={styles.listText}>
                                        Accept
                                      </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      disabled={refreshing}
                                      style={styles.btn}
                                      onPress={async () => {
                                        setRefreshing(true);
                                        if (refreshing) return;
                                        try {
                                          await rejectUser(
                                            connectedDevice?.device?.serialNum,
                                            user.id
                                          );
                                          await fetchDeviceUsers();
                                        } catch (err) {
                                          setRefreshing(false);
                                          //test
                                          console.log(err);
                                        }
                                      }}
                                    >
                                      <Text style={styles.listText}>
                                        Ignore
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                )}
                              </View>
                            )}
                          </View>
                        </View>
                        {(index < users?.length - 1 || index === 0) && (
                          <View
                            style={{
                              width: "100%",
                              height: 1,
                              marginTop: 10,
                              marginBottom: 10,
                              backgroundColor: "rgba(255,255,255,0.3)",
                            }}
                          />
                        )}
                      </View>
                    );
                  })
                ) : (
                  <View
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <MaterialCommunityIcons
                      style={styles.notfoundIcon}
                      name="cube"
                      size={30}
                      color="white"
                    />
                    <Text style={styles.nodeviceTxt}>No users connected</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          )}

          <View style={styles.ForgetPasswordBox}>
            <Text style={styles.forgetPasswordTxt}>FORGOT PASSWORD?</Text>

            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate("forgotpasswordprivate");
              }}
              style={styles.resetpasswordTxtIcon}
            >
              <Text style={styles.resetText}>Reset password</Text>
              <MaterialCommunityIcons
                name="arrow-right"
                size={25}
                color="white"
              />
            </TouchableOpacity>
          </View>
          <View style={{ paddingTop: 10, paddingBottom: 10, width: "100%" }}>
            <CarthagosButton
              width={"100%"}
              textColor="white"
              onPress={() => {
                logout();
              }}
              title="logout"
            />
          </View>
          <StatusBar backgroundColor={colors.black} barStyle="light-content" />
        </SafeAreaView>
      </View>
    </DismissMyKeyboard>
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
    width: "100%",
    height: 239,
    backgroundColor: colors.soft,
    paddingHorizontal: 15,
    paddingVertical: 12,
    justifyContent: "space-between",
  },

  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  connectedInfoContainer: {
    width: "100%",
    height: 180,
    backgroundColor: colors.soft,
    marginTop: 5,
    marginBottom: 15,
    padding: 10,
  },
  deviceCntd: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.white,
  },
  deviceTxtContainer: {
    flexDirection: "row",
    alignItems: "center",

    width: "100%",
    marginTop: 27,
  },
  email: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.white,
    fontFamily: "SF-Pro-Display",
    marginBottom: 4,
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
    width: "100%",
    height: 90,
    justifyContent: "space-between",
    padding: 18,
  },
  resetText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "SF-Pro-Display",
  },
  resetpasswordTxtIcon: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 154,
  },
  inputs: {
    backgroundColor: "#1B1B1B",
    width: "100%",
    height: 37,
    borderRadius: 5,
    fontSize: 16,
    padding: 10,
    marginTop: 5,
    color: colors.white,
    justifyContent: "center",
    fontFamily: "SF-Pro-Display",
    fontWeight: "400",
  },
  icon: {
    position: "absolute",
    right: 10,
    bottom: 5,
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
    width: 40,
  },
  phoneNumber: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.white,
    fontFamily: "SF-Pro-Display",
    marginBottom: 4,
  },
  profileTxt: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "800",
    textTransform: "uppercase",
    alignSelf: "flex-start",
    fontFamily: "Alternate-Gothic-bold",
    paddingBottom: 10,
  },

  forgetPasswordTxt: {
    fontSize: 20,
    textTransform: "uppercase",
    fontWeight: "800",
    color: colors.white,
    width: 135,
    fontFamily: "Alternate-Gothic-bold",
  },

  userName: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.white,
    fontFamily: "SF-Pro-Display",
    marginBottom: 4,
  },
  wrapper: {
    marginTop: 55,
    alignItems: "center",
    paddingHorizontal: 15,
  },
});
