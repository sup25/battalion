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

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    // Simulating an API call or any other initialization logic
    setTimeout(() => {
      setIsSplashVisible(false);
    }, 3000); // Replace this with your actual loading logic
  }, []);

  if (isSplashVisible) {
    return <Splash />;
  }

  return (
    <NavigationContainer>
      <AuthNavigator />
    </NavigationContainer>
  );
}
