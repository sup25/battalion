import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainScreen from "../../screen/Main/MainScreen";
import LoginScreen from "../../screen/Login/LoginScreen";
import RegisterScreen from "../../screen/Register/RegisterScreen";
import ForgotPasswordScreen from "../../screen/ForgotPasswordScreen";
import InsertCode from "../../screen/InsertCode/InsertCode";
import VerifyPhoneNum from "../../screen/VerifyPhoneNum";
import SelectUserOccupations from "../../screen/SelectUserOccupations";
import WelcomeScreen from "../../screen/Welcome/WelcomeScreen";
import TestingBleScreen from "../../screen/TestingBle";

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
        name="selectUserOccupations"
        component={SelectUserOccupations}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="Phoneverify"
        component={VerifyPhoneNum}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="ConfirmCode"
        component={InsertCode}
        options={{ headerShown: false, gestureEnabled: false }}
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
