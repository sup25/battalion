import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../config/Colors";
import ProfileScreen from "../../screens/private/profile";

import PublicRoute from "../PublicRoute";
import ForgotPassword from "../../screens/private/forgotPassword";

import DeviceSetting from "../../screens/private/deviceSetting";
import FourDigitCodeInsert from "../../screens/private/fourDigitCodeInsert";

import AddDevice from "../../screens/private/addDevice";
import BLEDeviceSearch from "../../screens/private/BLEdeviceSearch";

import TemperatureControlSlider from "../../screens/private/temperatureControlSlider";
import YourDevices from "../../screens/private/yourDevices";

import { FontsLoad } from "../../utils/FontsLoad";
import MainDeviceDetails from "../../screens/private/mainDeviceDetails";
import { useAuth } from "../../context/AuthProvider";
import { BleProvider } from "../../context/BLEProvider";
import { AppSettingProvider } from "../../context/AppSettingProvider";

const Tab = createBottomTabNavigator();

const PrivateRoute = () => {
  const { currentUser } = useAuth();

  if (!currentUser || !currentUser?.phoneNumber) {
    return <PublicRoute />;
  }
  useEffect(() => {
    FontsLoad();
  }, []);

  return (
    <AppSettingProvider>
      <BleProvider>
        <PrivateStackNavigator />
      </BleProvider>
    </AppSettingProvider>
  );
};

const PrivateStackNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName="MainTabs">
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
        name="devicesetting"
        component={DeviceSetting}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="fourdigitcodeinsert"
        component={FourDigitCodeInsert}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="bleDeviceSearch"
        component={BLEDeviceSearch}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="temperatureControlSlider"
        component={TemperatureControlSlider}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="yourDevices"
        component={YourDevices}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarLabelPosition: "beside-icon",
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 14,
          color: "#fff",
          fontFamily: "SF-Pro-Display",
          fontWeight: "500",
        },
        tabBarStyle: {
          height: 110,
          backgroundColor: "#000",
          flexDirection: "row",
        },
      })}
    >
      <Tab.Screen
        name="mainDeviceDetails"
        component={MainDeviceDetails}
        options={{
          tabBarLabel: "Home",
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
