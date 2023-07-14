import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./app/navigation/AuthNavigator";
import AppNavigator from "./app/navigation/AppNavigator";
import Splash from "./app/screen/Splash";
import { auth } from "./app/authentication/Firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceSetting from "./app/screen/DeviceSetting";

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUserAuthentication = async () => {
      const storedUser = await AsyncStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      setIsLoading(false);
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        AsyncStorage.setItem("user", JSON.stringify(user));
      } else {
        AsyncStorage.removeItem("user");
      }

      setUser(user);
      setIsLoading(false);
    });

    setTimeout(() => {
      setIsSplashVisible(false);
    }, 3000);

    checkUserAuthentication();

    return () => unsubscribe();
  }, []);

  if (isSplashVisible || isLoading) {
    return <Splash />;
  }

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
      {/*   <DeviceSetting /> */}
    </NavigationContainer>
  );
}
