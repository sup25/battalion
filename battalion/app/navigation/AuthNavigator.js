import React, { useEffect, useState, createContext, useContext } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../authentication/Firebase";
import LoggedOutNavigator from "./LoggedOutNavigator";
import LoggedInNavigator from "./LoggedInNavigator";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const userHandler = (user) => {
    user ? setCurrentUser(user) : setCurrentUser(null);
    setIsLoading(false); // Set loading state to false once user state is determined
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setCurrentUser(null);
      await AsyncStorage.removeItem("currentUser");
      console.log("Successfully logged out");

      // Navigate to LoggedOutNavigator
      navigation.navigate("LoggedOutNavigator");
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      userHandler(user);
      // Store the user authentication state in AsyncStorage
      if (user) {
        AsyncStorage.setItem("currentUser", JSON.stringify(user))
          .then(() => console.log("User authentication state stored"))
          .catch((error) =>
            console.log("Error storing user authentication state:", error)
          );
      }
    });

    // Retrieve user authentication state from AsyncStorage on app startup
    const checkUserAuthentication = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("currentUser");
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
          console.log(storedUser);
        }
        setIsLoading(false);
      } catch (error) {
        console.log("Error retrieving user authentication state:", error);
        setIsLoading(false); // Set loading state to false even in case of an error
      }
    };

    checkUserAuthentication();

    // Clean up the event listener when component unmounts
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    // Render loading state or a loader component
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ currentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthNavigator = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (currentUser && currentUser.phoneNumber) {
    // Render the LoggedInNavigator if the user is logged in and phone number is verified
    return <LoggedInNavigator />;
  } else {
    // Render the LoggedOutNavigator if the user is not logged in or phone number is not verified
    return <LoggedOutNavigator onLogout={handleLogout} />;
  }
};
