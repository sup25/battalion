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

  const [boxName, setBoxName] = useState("");

  const [temp, setTemp] = useState({ value: -1, unit: "c" });
  const [password, setPassword] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [isLightsOn, setIsLightsOn] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(false);
  const [isCharging, setIsCharging] = useState(false);

  const [connectedDevices, setConnectedDevices] = useState([]);
  const [devicesIds, setDevicesIds] = useState({});

  const resetStat = () => {
    setBoxTemp(-1);
    setBoxBatteryLevel(-1);
    setBoxIsCharging(false);
    setTemp({ value: -1, unit: "c" });
    setPassword([]);
    setIsLocked(false);
    setIsLightsOn(false);
    setBatteryLevel(false);
    setIsCharging(false);
    setBoxName("");
    AsyncStorage.removeItem("appSettings");
  };

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
    let parsedSettings = {};
    if (settings) {
      parsedSettings = JSON.parse(settings);
    }
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
    if (parsedSettings?.batteryLevel) {
      setBatteryLevel(parsedSettings.isLightsOn);
    }
    if (parsedSettings?.isCharging) {
      setIsCharging(parsedSettings.isCharging);
    }
    if (parsedSettings?.connectedDevices) {
      setConnectedDevices(parsedSettings.connectedDevices);
    }

    if (parsedSettings?.devicesIds) {
      setDevicesIds(parsedSettings.devicesIds);
    }
  };
  useEffect(() => {
    getItemsFromAsyncStorageAndSetToState();
  }, []);

  useEffect(() => {
    getItemFromAsyncStorage("appSettings");
  }, [temp, password, isLocked, isLightsOn]);

  const setBoxNameValue = async (value) => {
    setBoxName(value);
    await AsyncStorage.mergeItem(
      "appSettings",
      JSON.stringify({ name: value })
    );
  };

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

  const getTempValueAndUnit = (temp, toConvert) => {
    let val = temp.value < 0 ? "--" : temp.value;
    if (temp.unit === "f" && toConvert) val = Math.round((val * 9) / 5 + 32);
    const unit = temp.unit === "c" ? "℃" : "°F";
    return `${val}${unit}`;
  };

  const setDeviceBatteryLevel = async (value) => {
    setBatteryLevel(value);
    await AsyncStorage.mergeItem(
      "appSettings",
      JSON.stringify({ batteryLevel: value })
    );
  };

  const setDeviceIsCharging = async (value) => {
    setIsCharging(value);
    await AsyncStorage.mergeItem(
      "appSettings",
      JSON.stringify({ isCharging: value })
    );
  };

  const setConnectedDevice = async (BLEDevice) => {
    const device = {
      connected: true,
      id: BLEDevice.id,
      name: BLEDevice.name,
      device: BLEDevice,
    };
    setConnectedDevices((prev) => {
      const isDeviceAlreadyConnected = prev.find((d) => d.id === device.id);
      if (!isDeviceAlreadyConnected) {
        const devices = prev.map((d) => ({ ...d, connected: false }));
        AsyncStorage.mergeItem(
          "appSettings",
          JSON.stringify({ connectedDevices: [device, ...devices] })
        );
        return [device, ...devices];
      } else {
        const devices = prev
          .filter((d) => d.id !== isDeviceAlreadyConnected.id)
          .map((d) => ({ ...d, connected: false }));
        AsyncStorage.mergeItem(
          "appSettings",
          JSON.stringify({ connectedDevices: [device, ...devices] })
        );
        return [device, ...devices];
      }
    });
  };

  const setDevicesIdsBasedOnSerialNum = async (serialNum, deviceId) => {
    setDevicesIds((prev) => {
      if (prev?.[serialNum]) {
        if (prev[serialNum].includes(deviceId)) return prev;
        return { ...prev, [serialNum]: [...prev[serialNum], deviceId] };
      } else {
        prev[serialNum] = [deviceId];
        return prev;
      }
    });
    const settings = await getItemFromAsyncStorage("appSettings");

    const devices = settings.devicesIds
      ? settings.devicesIds
      : { [serialNum]: [] };
    await AsyncStorage.mergeItem(
      "appSettings",
      JSON.stringify({
        devicesIds: {
          ...devices,
          [serialNum]: [...devices[serialNum], deviceId],
        },
      })
    );
  };

  const contextValue = {
    temp,
    setTemp,
    password,
    isLocked,
    isLightsOn,

    setTempValue,
    setTempUnit,
    setDevicePassword,
    setDeviceIsLocked,
    setDeviceBatteryLevel,
    setDeviceIsCharging,
    setDeviceIsLightsOn,
    getTempValueAndUnit,

    connectedDevices,
    setConnectedDevice,

    boxTemp,
    setBoxTemp,
    boxPassword,
    boxLights,
    boxLocked,
    boxBatteryLevel,
    setBoxBatteryLevel,
    boxIsCharging,
    setBoxIsCharging,

    boxName,
    setBoxNameValue,

    resetStat,

    devicesIds,
    setDevicesIdsBasedOnSerialNum,
  };

  return (
    <AppSettingContext.Provider value={contextValue}>
      {children}
    </AppSettingContext.Provider>
  );
};
