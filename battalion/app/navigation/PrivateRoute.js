import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import ProfileScreen from "../screen/Profile/ProfileScreen";
import WelcomeScreen from "../screen/Welcome/WelcomeScreen";
import { useAuth } from "../utils/AuthProvider";
import PublicRoute from "./PublicRoute";
import ForgotPassword from "../screen/ForgetPasswordPrivate";
import DeviceDetails from "../screen/DeviceDetail/DeviceDetails";
import DeviceSetting from "../screen/DeviceSetting/DeviceSetting";
import SetTemperatureScreen from "../screen/SetTemperatureScreen";
import FourDigitCodeInsertScreen from "../screen/FourDigitCodeInsertScreen";

import AddDevice from "../screen/AddDevice/AddDevice";
import SearchScreen from "../screen/Search/SearchScreen";
import TestingBLE from "../screen/Search/TestingBLE";
import HalfCircleSlider from "../screen/Search/testScreen";

const Tab = createBottomTabNavigator();

const PrivateRoute = () => {
  const { currentUser } = useAuth();

  if (!currentUser || !currentUser?.phoneNumber) {
    return <PublicRoute />;
  }

  return <PrivateStackNavigator />;
};

const PrivateStackNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="addDevice"
        component={AddDevice}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="forgotpasswordprivate"
        component={ForgotPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="devicedetails"
        component={DeviceDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="devicesetting"
        component={DeviceSetting}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="setTemperatureScreen"
        component={SetTemperatureScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="fourdigitcodeinsertscreen"
        component={FourDigitCodeInsertScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="searchscreen"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="testingBLE"
        component={TestingBLE}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="testSlider"
        component={HalfCircleSlider}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={() => ({
        headerShown: false,
        tabBarLabelStyle: { fontSize: 15, color: "#fff" },
        tabBarStyle: {
          backgroundColor: "#000",
          flexDirection: "row",
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={WelcomeScreen}
        options={{
          tabBarIcon: ({ size, focused }) => (
            <MaterialCommunityIcons
              name="home"
              color={focused ? colors.white : "#676767"}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ size, focused }) => (
            <MaterialCommunityIcons
              name="account"
              color={focused ? colors.white : "#676767"}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default PrivateRoute;
