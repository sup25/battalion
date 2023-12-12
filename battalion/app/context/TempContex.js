import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TempContext = createContext();

export const useTempContext = () => useContext(TempContext);

export const TemperatureProvider = ({ children }) => {
  const [degreesType, setDegreesType] = useState("c");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Retrieve the settings from AsyncStorage
        const settingsString = await AsyncStorage.getItem("settings");
        const settings = settingsString ? JSON.parse(settingsString) : {};
        // Set the degreesType from the stored settings or default to 'f'
        setDegreesType(settings.degrees_type || "f");
      } catch (error) {
        console.log("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []);

  const updateDegreesType = async (newDegreesType) => {
    setDegreesType(newDegreesType);

    try {
      // Update the degreesType in AsyncStorage
      await AsyncStorage.setItem(
        "settings",
        JSON.stringify({ degrees_type: newDegreesType })
      );
      console.log(
        "DegreesType updated and stored in AsyncStorage:",
        newDegreesType
      );
    } catch (error) {
      console.log("Error updating settings:", error);
    }
  };

  const contextValue = {
    degreesType,
    setDegreesType,
    updateDegreesType,
  };

  return (
    <TempContext.Provider value={contextValue}>{children}</TempContext.Provider>
  );
};
