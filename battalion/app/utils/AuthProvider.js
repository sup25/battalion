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
    setIsLoading(false); // Set loading state to false once user state is determined
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
        setIsLoading(false);
      }
    };

    // Call the function to retrieve user authentication state from AsyncStorage
    checkUserAuthentication();
  }, []);

  
  useEffect(() => {
    // Initialize a variable to track whether fetching user data is complete
    let isFetchComplete = false;
  
    // Fetch the user data from Firebase during initialization
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        userHandler(user);
  
        // Store the user authentication state in AsyncStorage
        if (user) {
          await AsyncStorage.setItem("currentUser", JSON.stringify(user));
          console.log("User authentication state stored");
        }
  
        // Mark user data fetching as complete
        isFetchComplete = true;
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };
  
    const unsubscribe = auth.onAuthStateChanged((user) => {
      userHandler(user);
  
      // If user data fetching is complete, set isLoading to false
      if (isFetchComplete) {
        setIsLoading(false);
      }
    });
  
    // Fetch user data from Firebase during app startup
    fetchUserData();
  
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
