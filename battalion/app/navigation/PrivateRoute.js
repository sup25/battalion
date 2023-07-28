import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import ProfileScreen from "../screen/ProfileScreen";
import WelcomeScreen from "../screen/WelcomeScreen";
import { useAuth } from "../navigation/AuthNavigator";
import PublicRoute from "./PublicRoute";
import VerifyPhoneManually from "../screen/VerifyPhoneManually";
import ForgotPasswordScreen from "../screen/ForgotPasswordScreen";

const Tab = createBottomTabNavigator();

const PrivateRoute = () => {
  const { currentUser } = useAuth();

  // Check if currentUser and currentUser.phoneNumber exist
  if (currentUser && currentUser.phoneNumber) {
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
          name="forgotPasswordScreen"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  } else {
    return <PublicRoute />;
  }
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={() => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000",
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={WelcomeScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
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
          tabBarIcon: ({ color, size, focused }) => (
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
