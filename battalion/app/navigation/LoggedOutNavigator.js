import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainScreen from "../screen/MainScreen";
import LoginScreen from "../screen/LoginScreen";
import RegisterScreen from "../screen/RegisterScreen";

import ForgotPasswordScreen from "../screen/ForgotPasswordScreen";
import WelcomeScreen from "../screen/WelcomeScreen";
import InserCode from "../screen/InsertCode";
import VerifyPhoneOne from "../screen/VerifyPhoneOne";
import ProfileScreen from "../screen/ProfileScreen";
import VerifyPhoneManually from "../screen/VerifyPhoneManually";
const Stack = createNativeStackNavigator();
const LoggedOutNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Phoneverify"
        component={VerifyPhoneOne}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ConfirmCode"
        component={InserCode}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Manually"
        component={VerifyPhoneManually}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPass"
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default LoggedOutNavigator;
