import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainScreen from "../screen/MainScreen";
import LoginScreen from "../screen/LoginScreen";
import RegisterScreen from "../screen/RegisterScreen";
const Stack = createNativeStackNavigator();

import ForgotPasswordScreen from "../screen/ForgotPasswordScreen";
import WelcomeScreen from "../screen/WelcomeScreen";
import InserCode from "../screen/InsertCode";
import VerifyPhoneOne from "../screen/VerifyPhoneOne";

const AuthNavigator = () => {
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
        name="phoneverify"
        component={VerifyPhoneOne}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ConfirmCode"
        component={InserCode}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={WelcomeScreen}
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

export default AuthNavigator;
