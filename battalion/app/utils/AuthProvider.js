import React, { useEffect, useState, createContext, useContext } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../config/Firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation();

  const userHandler = (user) => {
    user ? setCurrentUser(user) : setCurrentUser(null);
    setIsLoading(false);
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setCurrentUser(null);
      await AsyncStorage.removeItem("currentUser");
      console.log("Successfully logged out");

      // Use the passed navigation instance for navigation
      navigation.navigate("publicRoute");
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      // Check if a user is authenticated
      if (user) {
        // If the user is authenticated, set the current user state
        userHandler(user);

        // Store the user authentication state in AsyncStorage
        try {
          await AsyncStorage.setItem("currentUser", JSON.stringify(user));
          console.log("User authentication state stored");
        } catch (error) {
          console.log("Error storing user authentication state:", error);
        }
      } else {
        // If no user is authenticated, check AsyncStorage for stored user data
        try {
          const storedUser = await AsyncStorage.getItem("currentUser");
          if (storedUser) {
            // Parse and set the current user state
            setCurrentUser(JSON.parse(storedUser));
            console.log(storedUser);
          }
        } catch (error) {
          console.log("Error retrieving user authentication state:", error);
        }
      }

      // Set loading state to false once user state is determined
      setIsLoading(false);
    });

    // Clean up the event listener when the component unmounts
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
