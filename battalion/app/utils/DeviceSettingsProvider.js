import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DeviceSettingsContext = createContext();

const DeviceSettingsProvider = ({ children }) => {
  const [temp, setTemp] = useState({ value: 0, unit: "c" });
  const [password, setPassword] = useState([1, 2, 3, 4]);
  const [isLocked, setIsLocked] = useState(false);
  const [isLightsOn, setIsLightsOn] = useState(false);

  const getItemFromAsyncStorage = async (itemName) => {
    try {
      const value = await AsyncStorage.getItem(itemName);
      if (value !== null) {
        return value;
      }
    } catch (error) {
      console.log("settings context error, getting async item", error);
    }
  };

  const getItemsFromAsyncStorageAndSetToState = async () => {
    const settings = await getItemFromAsyncStorage("deviceSettings");
    const parsedSettings = JSON.parse(settings);

    if (parsedSettings?.temp?.value) {
      setTemp((prev) => ({ ...prev, value: parsedSettings.temp.value }));
    }
    if (parsedSettings?.temp?.unit) {
      setTemp((prev) => ({ ...prev, unit: parsedSettings.temp.unit }));
    }
    if (parsedSettings?.password) {
      setPassword(parsedSettings.password);
    }
    if (parsedSettings?.isLocked) {
      setIsLocked(parsedSettings.isLocked);
    }
    if (parsedSettings?.isLightsOn) {
      setIsLightsOn(parsedSettings.isLightsOn);
    }
  };

  useEffect(() => {
    getItemsFromAsyncStorageAndSetToState();
  }, []);

  useEffect(() => {
    getItemFromAsyncStorage("deviceSettings");
  }, [temp, password, isLocked, isLightsOn]);

  const setTempValue = async (value) => {
    setTemp((prev) => ({ ...prev, value }));
    await AsyncStorage.mergeItem(
      "deviceSettings",
      JSON.stringify({ temp: { value } })
    );
  };
  const setTempUnit = async (unit) => {
    setTemp((prev) => ({ ...prev, unit }));
    await AsyncStorage.mergeItem(
      "deviceSettings",
      JSON.stringify({ temp: { unit } })
    );
  };
  const setDevicePassword = async (value) => {
    setPassword(value);
    await AsyncStorage.mergeItem(
      "deviceSettings",
      JSON.stringify({ password: value })
    );
  };
  const setDeviceIsLocked = async (value) => {
    setIsLocked(value);
    await AsyncStorage.mergeItem(
      "deviceSettings",
      JSON.stringify({ isLocked: value })
    );
  };
  const setDeviceIsLightsOn = async (value) => {
    setIsLightsOn(value);
    await AsyncStorage.mergeItem(
      "deviceSettings",
      JSON.stringify({ isLightsOn: value })
    );
  };

  const getTempValueAndUnit = (temp) => {
    const val = temp.unit === "c" ? temp.value : (temp.value * 9) / 5 + 32;
    const unit = temp.unit === "c" ? "℃" : "F";
    return `${val}${unit}`;
  };

  return (
    <DeviceSettingsContext.Provider
      value={{
        temp,
        password,
        isLocked,
        isLightsOn,
        setTempValue,
        setTempUnit,
        setDevicePassword,
        setDeviceIsLocked,
        setDeviceIsLightsOn,
        getTempValueAndUnit,
      }}
    >
      {children}
    </DeviceSettingsContext.Provider>
  );
};

const useDeviceSettingsContext = () => useContext(DeviceSettingsContext);

export { DeviceSettingsProvider, useDeviceSettingsContext };
