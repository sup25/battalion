import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AppSettingContext = createContext();

export const useAppSettingContext = () => useContext(AppSettingContext);

export const AppSettingProvider = ({ children }) => {
  const [boxTemp, setBoxTemp] = useState(-1);
  const [boxBatteryLevel, setBoxBatteryLevel] = useState(-1);
  const [boxIsCharging, setBoxIsCharging] = useState(false);

  const [boxPassword, setBoxPassword] = useState([]);
  const [boxLights, setBoxLights] = useState(false);
  const [boxLocked, setBoxLocked] = useState(false);

  const [temp, setTemp] = useState({ value: -1, unit: "c" });
  const [password, setPassword] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [isLightsOn, setIsLightsOn] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(false);
  const [isCharging, setIsCharging] = useState(false);

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
    const settings = await getItemFromAsyncStorage("appSettings");
    const parsedSettings = JSON.parse(settings);
    console.log("appSettings:", parsedSettings);
    if (parsedSettings?.temp?.value) {
      setTemp((prev) => ({ ...prev, value: parsedSettings.temp.value }));
    }
    if (parsedSettings?.temp?.unit) {
      setTemp((prev) => ({ ...prev, unit: parsedSettings.temp.unit }));
    }
    if (parsedSettings?.password) {
      setPassword(Array.from(parsedSettings.password).map(Number));
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
    getItemFromAsyncStorage("appSettings");
  }, [temp, password, isLocked, isLightsOn]);

  const setTempValue = async (value) => {
    setTemp((prev) => ({ ...prev, value }));
    await AsyncStorage.mergeItem(
      "appSettings",
      JSON.stringify({ temp: { value } })
    );
  };

  const setTempUnit = async (unit) => {
    setTemp((prev) => ({ ...prev, unit }));
    await AsyncStorage.mergeItem(
      "appSettings",
      JSON.stringify({ temp: { unit } })
    );
  };

  const setDevicePassword = async (value) => {
    setPassword(value);
    await AsyncStorage.mergeItem(
      "appSettings",
      JSON.stringify({ password: value })
    );
  };

  const setDeviceIsLocked = async (value) => {
    setIsLocked(value);
    await AsyncStorage.mergeItem(
      "appSettings",
      JSON.stringify({ isLocked: value })
    );
  };

  const setDeviceIsLightsOn = async (value) => {
    setIsLightsOn(value);
    await AsyncStorage.mergeItem(
      "appSettings",
      JSON.stringify({ isLightsOn: value })
    );
  };

  const getTempValueAndUnit = (temp) => {
    const val = temp.unit === "c" ? temp.value : (temp.value * 9) / 5 + 32;
    const unit = temp.unit === "c" ? "℃" : "°F";
    return `${val}${unit}`;
  };

  const contextValue = {
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

    boxTemp,
    setBoxTemp,
    boxPassword,
    boxLights,
    boxLocked,
    boxBatteryLevel,
    setBoxBatteryLevel,
    boxIsCharging,
    setBoxIsCharging,
  };

  return (
    <AppSettingContext.Provider value={contextValue}>
      {children}
    </AppSettingContext.Provider>
  );
};
