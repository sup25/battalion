import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainScreen from "../screen/MainScreen";
import LoginScreen from "../screen/LoginScreen";
import RegisterScreen from "../screen/RegisterScreen";

import ForgotPasswordScreen from "../screen/ForgotPasswordScreen";

import InsertCode from "../screen/InsertCode";
import VerifyPhoneOne from "../screen/VerifyPhoneOne";
import VerifyPhoneManually from "../screen/VerifyPhoneManually";

const Stack = createNativeStackNavigator();
const PublicRoute = () => {
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
        component={InsertCode}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="verifyphonemanually"
        component={VerifyPhoneManually}
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

export default PublicRoute;
