import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../authentication/Firebase";

export const CredentialContext = createContext({ user: {}, setUser: () => {} });

const CredentialProvider = ({ children }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const checkUserAuthentication = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.log("Error retrieving user:", error);
      }
    };

    checkUserAuthentication();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authenticatedUser) => {
      if (authenticatedUser) {
        const token = await authenticatedUser.getIdToken();
        const user = { token };
        AsyncStorage.setItem("user", JSON.stringify(user));
        setUser(user);
      } else {
        AsyncStorage.removeItem("user");
        setUser({});
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <CredentialContext.Provider value={{ user, setUser }}>
      {children}
    </CredentialContext.Provider>
  );
};

export default CredentialProvider;
