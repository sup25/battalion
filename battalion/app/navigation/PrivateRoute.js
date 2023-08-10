import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import ProfileScreen from "../screen/ProfileScreen";
import WelcomeScreen from "../screen/WelcomeScreen";
import { useAuth } from "../utils/AuthProvider";
import PublicRoute from "./PublicRoute";
import VerifyPhoneManually from "../screen/VerifyPhoneManually";
import ForgotPassword from "../screen/ForgetPasswordPrivate";
import DeviceDetails from "../screen/DeviceDetails";
import DeviceSetting from "../screen/DeviceSetting";

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
        name="verifyphonemanually"
        component={VerifyPhoneManually}
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
