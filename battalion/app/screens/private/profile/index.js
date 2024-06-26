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
  FlatList,
} from "react-native";
import DismissMyKeyboard from "../../../components/DismissMyKeyboard";

import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../../../config/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import CarthagosButton from "../../../components/CarthagosButton";
import {
  aproveUser,
  disconnectUser,
  getDeviceUsers,
  rejectUser,
} from "../../../api/devices";
import { useBleContext } from "../../../context/BLEProvider";
import { Toast } from "react-native-toast-notifications";
import { FontsLoad } from "../../../utils/FontsLoad";
import { useAuth } from "../../../context/AuthProvider";
import { getUserById } from "../../../api/users";

const ProfileScreen = (props) => {
  const { currentUser, logout } = useAuth();
  const { connectedDevice } = useBleContext();

  const [userProfileData, setUserProfileData] = useState();
  const [updatedUserName, setUpdatedUserName] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [userEmail, setUserEmail] = useState();

  const [isEditingUsername, setIsEditingUsername] = useState(false);

  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getAndSetUserProfileData = async () => {
    const userData = await getUserById(currentUser.uid);
    setUserProfileData(userData);
    setUpdatedUserName(userData?.name || "");
    setUserEmail(userData?.email);
    setPhoneNumber(userData?.phoneNumber);
  };

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
    FontsLoad();
    getAndSetUserProfileData();
  }, []);

  const handleUsernameEdit = () => {
    setIsEditingUsername(!isEditingUsername);
  };

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
      <ScrollView nestedScrollEnabled={true} style={styles.container}>
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
              <View style={styles.connectedInfoContainer}>
                {users?.length > 0 ? (
                  <FlatList
                    nestedScrollEnabled={true}
                    ItemSeparatorComponent={
                      <View
                        style={{
                          height: 1,
                          backgroundColor: "white",
                          opacity: 0.1,
                        }}
                      />
                    }
                    data={users}
                    renderItem={({ item }) => {
                      const user = item;

                      return (
                        <View
                          style={{
                            padding: 10,
                            height: 50,
                          }}
                        >
                          <View
                            style={{
                              justifyContent: "space-between",
                              alignItems: "center",
                              width: "100%",
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            <Text
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
                                    <Text style={styles.listText}>
                                      Rejected
                                    </Text>
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
                                          if (refreshing) return;
                                          setRefreshing(true);
                                          try {
                                            await aproveUser(
                                              connectedDevice?.device
                                                ?.serialNum,
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
                                              connectedDevice?.device
                                                ?.serialNum,
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
                                          Ignore
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  )}
                                </View>
                              )}
                            </View>
                          </View>
                        </View>
                      );
                    }}
                    keyExtractor={(item) => item.id}
                  />
                ) : (
                  <View
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 150,
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
              </View>
            </View>
          )}

          <View style={styles.ForgetPasswordBox}>
            <Text style={styles.forgetPasswordTxt}>FORGOT {"\n"}PASSWORD?</Text>

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
          <View style={{ paddingTop: 8, paddingBottom: 8, width: "100%" }}>
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
      </ScrollView>
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

    paddingTop: 20,
  },
  connectedInfoContainer: {
    height: 180,
    backgroundColor: colors.soft,
    marginTop: 5,
    marginBottom: 15,
    paddingHorizontal: 5,
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
    marginTop: 15,
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
    padding: 15,
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
    lineHeight: 18,
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
    fontFamily: "Alternate-Gothic-bold",
  },

  userName: {
    fontSize: 14,
    lineHeight: 16,
    fontWeight: "500",
    color: colors.white,
    fontFamily: "SF-Pro-Display",
    marginBottom: 4,
  },
  wrapper: {
    marginTop: 55,
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
});
