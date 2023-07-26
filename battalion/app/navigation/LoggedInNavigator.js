import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import ProfileScreen from "../screen/ProfileScreen";
import WelcomeScreen from "../screen/WelcomeScreen";
import Test from "../screen/Test";
const Tab = createBottomTabNavigator();

const LoggedInNavigator = () => (
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
    <Tab.Screen
      name="Testing"
      component={Test}
      options={{
        tabBarIcon: ({ color, size, focused }) => (
          <MaterialCommunityIcons
            name="arrow-right-circle"
            color={focused ? colors.white : "#676767"}
            size={size}
          />
        ),
      }}
    />
  </Tab.Navigator>
);

export default LoggedInNavigator;
