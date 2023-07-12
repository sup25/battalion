import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./app/navigation/AuthNavigator";
import Occupation from "./app/screen/Occupation";
import Splash from "./app/screen/splash";
import VerifyPhoneManually from "./app/screen/VerifyPhoneManually";
import VerifyPhoneOne from "./app/screen/VerifyPhoneOne";
import InserCode from "./app/screen/InsertCode";
import ScanScreen from "./app/screen/ScanScreen";
import AfterScanScreen from "./app/screen/AfterScanScreen";
import FoundDevices from "./app/screen/FoundDevices";
import ConnectionScreen from "./app/screen/ConnectionScreen";
import ConnectionRejectScreen from "./app/screen/ConnectionRejectScreen";
import DigitPassword from "./app/screen/DigitPassword";

import AppNavigator from "./app/navigation/AppNavigator";
import { auth } from "./app/authentication/Firebase";
export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
      setTimeout(() => {
        setIsSplashVisible(false);
      }, 2000); // Delay of 2000 milliseconds (2 seconds)
    });

    return () => unsubscribe();
  }, []);

  if (isSplashVisible) {
    return <Splash />;
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
