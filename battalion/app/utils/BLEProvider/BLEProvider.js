import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  useEffect,
} from "react";
import { BleManager } from "react-native-ble-plx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ExpoDevice from "expo-device";
import { AppState, PermissionsAndroid, Platform } from "react-native";
import { Buffer } from "buffer";
import { useAppSettingContext } from "../../context/AppSettingContext/AppSettingContext";
import appConfig from "../../config/app";

import { useToast } from "react-native-toast-notifications";
import { useAuth } from "../AuthProvider/AuthProvider";
import {
  checkIfUserHasPermissionToConnect,
  checkIfUserIsOwner,
} from "../../api/Database/Database";
const BleContext = createContext();

const BleProvider = ({ children }) => {
  const SPS_SERVICE_UUID = "19b10000-e8f2-537e-4f6c-d104768a1214";
  const SPS_SERVER_TX_UUID = "19B10001-E8F2-537E-4F6C-D104768A1214";
  const SPS_SERVER_RX_UUID = "19B10002-E8F2-537E-4F6C-D104768A1214";
  // const SPS_SERVICE_UUID = "6e410001-b5a3-f393-e0a9-e50e54dccaa0";
  // const SPS_SERVER_TX_UUID = "6e410002-b5a3-f393-e0a9-e50e54dccaa0";
  // const SPS_SERVER_RX_UUID = "6e410003-b5a3-f393-e0a9-e50e54dccaa0";

  const Toast = useToast();
  const devices = appConfig.env === "dev" ? appConfig.testDevices : [];
  const {
    setBoxTemp,
    setBoxBatteryLevel,
    setBoxIsCharging,
    setDevicePassword,
    setDeviceIsLocked,
    setDeviceIsLightsOn,
    password,
    temp,
    setTemp,
    isLightsOn,
    setBoxNameValue,
    resetStat,
  } = useAppSettingContext();
  const bleManager = useMemo(() => new BleManager(), []);

  const { currentUser } = useAuth();

  const [device, setDevice] = useState(null);
  const [scan, setScan] = useState({
    scanning: false,
    devices,
    error: null,
  });
  const [connectedDevice, setConnectedDevice] = useState({
    device: null,
    error: null,
    isOwner: false,
    connecting: true,
  });

  const getItemFromAsyncStorage = async (itemName, child = false) => {
    try {
      const value = await AsyncStorage.getItem(itemName);
      if (value !== null) {
        const obj = JSON.parse(value);
        if (obj[child]) {
          return obj[child];
        }
      }
    } catch (error) {
      console.log("settings context error, getting async item", error);
    }
  };
  const connectToDeviceOnStart = async () => {
    if (currentUser) {
      const storedDeviceId = await getItemFromAsyncStorage(
        "appSettings",
        "connectedDevices"
      );

      if (storedDeviceId) {
        Toast.show(
          `Trying to reconnect to the device (${storedDeviceId?.[0]?.device?.name}).`,
          {
            type: "normal",
          }
        );
        try {
          await connectToDevice(storedDeviceId?.[0]?.device);
          Toast.show("Device reconnected successfuly.", {
            type: "normal",
          });
        } catch (e) {
          Toast.show("Couldn't reconnect to the device.", {
            type: "normal",
          });
          resetStat();
          setConnectedDevice((prev) => ({
            ...prev,
            isOwner: false,
            connecting: false,
            device: null,
          }));
        }
      } else {
        Toast.show("Couldn't reconnect to the device.", {
          type: "normal",
        });
        resetStat();
        setConnectedDevice((prev) => ({
          ...prev,
          isOwner: false,
          connecting: false,
          device: null,
        }));
      }
    }
  };

  useEffect(() => {
    connectToDeviceOnStart();
    const subscribe = AppState.addEventListener("change", handleAppStateChange);
    return () => {
      subscribe.remove();
    };
  }, []);

  const handleAppStateChange = async (nextAppState) => {
    console.log(nextAppState);
    if (currentUser) {
      // Check app state changes and manage BLE connections accordingly
      if (nextAppState === "active") {
        Toast.show("Reconnecting to the device.", {
          type: "normal",
        });
        // App has come to the foreground, attempt reconnection if needed
        const storedDeviceId = await getItemFromAsyncStorage(
          "appSettings",
          "connectedDevices"
        );

        if (storedDeviceId) {
          try {
            await connectToDevice(storedDeviceId?.[0]?.device);
            Toast.show("Device reconnected successfuly.", {
              type: "normal",
            });
          } catch (e) {
            Toast.show("Couldn't reconnect to the device.", {
              type: "normal",
            });
            resetStat();
            setConnectedDevice((prev) => ({
              ...prev,
              isOwner: false,
              connecting: false,
              device: null,
            }));
          }
        } else {
          Toast.show("Couldn't reconnect to the device.", {
            type: "normal",
          });
          resetStat();

          setConnectedDevice((prev) => ({
            ...prev,
            isOwner: false,
            connecting: false,
            device: null,
          }));
        }
      } else {
        // App is in the background or inactive, handle disconnection or suspend operations
        // Disconnect or perform necessary actions when app goes to background
      }
    }
  };

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  const isDuplicteDevice = (devices, nextDevice) => {
    return devices.findIndex((device) => nextDevice.id === device.id) > -1;
  };

  const scanForPeripherals = async (toast = false, startTime = false) => {
    setConnectedDevice((prev) => ({ ...prev, connecting: false }));
    setScan((prev) => ({
      ...prev,
      scanning: true,
    }));
    bleManager.startDeviceScan(
      [SPS_SERVICE_UUID],
      // null,
      { allowDuplicates: false },
      (error, device) => {
        if (startTime) {
          let endTime = new Date();
          var timeDiff = endTime - startTime; //in ms
          // strip the ms
          timeDiff /= 1000;
          // get seconds
          var seconds = Math.round(timeDiff);
        }

        if (error) {
          setScan((prev) => ({
            ...prev,
            error: error.message,
            scanning: false,
          }));

          bleManager.stopDeviceScan();
          seconds = 19;
          toast.show(
            "Error scanning for devices, check if blutooth is on and try again",
            {
              type: "normal",
              placement: "bottom",
            }
          );
          return error;
        }
        if (device) {
          setScan((prev) => {
            if (!isDuplicteDevice(prev.devices, device)) {
              return {
                ...prev,
                devices: [...prev.devices, device],
              };
            }
            return prev;
          });
        }

        if (startTime) {
          if (seconds > 18) {
            setScan((prev) => ({ ...prev, scanning: false }));
            bleManager.stopDeviceScan(); //stop scanning if more than 5 secs passed
          }
        }
      }
    );
  };

  const connectToDevice = async (device, setDevice) => {
    setConnectedDevice((prev) => ({ ...prev, connecting: true }));
    bleManager.stopDeviceScan();
    try {
      const deviceFromDb = await checkIfUserHasPermissionToConnect(
        currentUser.uid,
        device.id
      );
      if (!deviceFromDb) {
        setConnectedDevice((prev) => ({
          device: null,
          isOwner: false,
          error: "You don't have permission to connect to this device",
          connecting: false,
        }));
        Toast.show("You don't have permission to connect to this device");
        throw new Error("You don't have permission to connect to this device");
      }
      setBoxNameValue(deviceFromDb.name);
      const isOwner = await checkIfUserIsOwner(currentUser.uid, device.id);
      const setTimeOut = setTimeout(async () => {
        await bleManager.cancelDeviceConnection(device.id);
        setConnectedDevice((prev) => ({
          device: null,
          isOwner: false,
          error: "Connection timeout",
          connecting: false,
        }));
        clearTimeout(setTimeOut);
        Toast.show("Timeout, failed to connect");
        throw new Error("Connection timeout");
      }, 15000);
      const deviceConnection = await bleManager.connectToDevice(device.id);

      const connectedDevice =
        await deviceConnection.discoverAllServicesAndCharacteristics();
      const services = await connectedDevice?.services();
      // Log the UUIDs of services
      services.forEach(async (service) => {
        // Log the UUIDs of characteristics

        const characteristics = await service.characteristics();
        characteristics.forEach((characteristic) => {});
      });
      setConnectedDevice((prev) => ({
        error: null,
        device: deviceConnection,
        isOwner: isOwner,
        connecting: false,
      }));
      console.log("connected!", deviceConnection.id, deviceConnection.name);
      clearTimeout(setTimeOut);
      return deviceConnection;
    } catch (e) {
      clearTimeout(setTimeOut);
      setConnectedDevice((prev) => ({
        device: null,
        error: e.message,
        isOwner: false,
        connecting: false,
      }));
      console.log("FAILED TO CONNECT", e);
      throw e;
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice?.device) {
      bleManager.stopDeviceScan();
      bleManager.cancelDeviceConnection(connectedDevice?.device.id);
      setConnectedDevice((prev) => ({ ...prev, isOwner: false, device: null }));
    }
  };

  const stopScanning = () => {
    setScan((prev) => ({ ...prev, scanning: false }));
    bleManager.stopDeviceScan();
  };

  /**
   * !index 0 must be 85, index 1 will be a prefix, index 2,3,4,5 will be password....
   * @param {array} data - array of numbers [85,1,1,2,3,4]
   */
  const getBase64Data = (data) => {
    console.log("og data: ", data);
    let bufferData = Buffer.from(data);

    // Convert to hex
    const hexString = bufferData.toString("hex");
    console.log("hex: ", hexString);
    // Convert hex to base64
    const base64String = Buffer.from(hexString, "hex").toString("base64");

    return base64String;
  };
  const getDataFromArray = (base64Data) => {
    console.log("1", base64Data);
    // Convert base64 to hex
    const hexString = Buffer.from(base64Data, "base64").toString("hex");
    console.log("2", hexString);
    // Convert hex to buffer
    const bufferData = Buffer.from(hexString, "hex");
    console.log("3", bufferData);
    // Convert buffer to data array in base 10
    const dataArray = Array.from(bufferData);
    console.log("4", dataArray);
    return dataArray;
  };

  const writePasswordToDevice = async (data = false) => {
    const prefix = [85, 1];

    if (data) {
      if (data.length < 4) throw new Error("Password must be 4 digits");
    }

    const base64String = getBase64Data(prefix.concat(data));
    try {
      let res =
        await connectedDevice?.device.writeCharacteristicWithResponseForService(
          SPS_SERVICE_UUID,
          SPS_SERVER_TX_UUID, // Use the appropriate UUID for writing
          base64String
        );

      console.log("res", res.value);
      console.log("res", getDataFromArray(res.value));
      return res;
      // Password set successfully
    } catch (error) {
      console.log("err in write password", error);
      throw error;
      // Handle error while setting password
    }
  };

  /**
   *
   * @param {number} temperatur
   * @returns
   */
  const writeTempToDevice = async (unit, temperatur = false) => {
    const prefix = [85, 3];
    console.log("temp.unit ", temp.unit);
    console.log("unit ", unit);
    const data = prefix.concat(
      password,
      [temperatur],
      [unit],
      [isLightsOn ? 1 : 0]
    );

    const base64String = getBase64Data(data);

    try {
      let res =
        await connectedDevice?.device.writeCharacteristicWithResponseForService(
          SPS_SERVICE_UUID,
          SPS_SERVER_TX_UUID, // Use the appropriate UUID for writing
          base64String
        );

      return res;
      // Password set successfully
    } catch (error) {
      console.log("err in write temp", error);
      throw error;
      // Handle error while setting password
    }
  };

  const writeTempUnitToDevice = async (unit = false) => {
    const prefix = [85, 3];
    const data = prefix.concat(
      password,
      [temp.value],
      [unit ? unit : temp.unit === "c" ? 0 : 1],
      [isLightsOn ? 1 : 0]
    );

    const base64String = getBase64Data(data);

    try {
      let res =
        await connectedDevice?.device.writeCharacteristicWithResponseForService(
          SPS_SERVICE_UUID,
          SPS_SERVER_TX_UUID, // Use the appropriate UUID for writing
          base64String
        );

      return res;
      // Password set successfully
    } catch (error) {
      console.log("err in write temp", error);
      throw error;
      // Handle error while setting password
    }
  };

  /**
   *
   * @param {number} lightsState - 0 for off, 1 for on (auto)
   * @returns
   */
  const writeLightsToDevice = async (lightsState) => {
    const prefix = [85, 3];
    const data = prefix.concat(
      password,
      [temp.value],
      [temp.unit === "c" ? 0 : 1],
      [lightsState]
    );

    const base64String = getBase64Data(data);

    try {
      let res =
        await connectedDevice?.device.writeCharacteristicWithResponseForService(
          SPS_SERVICE_UUID,
          SPS_SERVER_TX_UUID, // Use the appropriate UUID for writing
          base64String
        );

      return res;
      // Password set successfully
    } catch (error) {
      console.log("err in write light", error);
      throw error;
      // Handle error while setting password
    }
  };

  const writeLockToggleToDevice = async (data = false) => {
    const prefix = [85, 4];
    const prefixAndPass = prefix.concat(password, data);

    const base64String = getBase64Data(prefixAndPass);

    try {
      let res =
        await connectedDevice?.device.writeCharacteristicWithResponseForService(
          SPS_SERVICE_UUID,
          SPS_SERVER_TX_UUID, // Use the appropriate UUID for writing
          base64String
        );

      return res;
      // Password set successfully
    } catch (error) {
      console.log("err in write lock toggle", error);
      throw error;
      // Handle error while setting password
    }
  };
  const updateCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const hoursH = Math.floor(hours / 10);
    const hoursL = hours % 10;
    const minutesH = Math.floor(minutes / 10);
    const minutesL = minutes % 10;

    return [hoursH, hoursL, minutesH, minutesL];
  };
  const writeTimeToDevice = async (data = false) => {
    const prefix = [85, 2];
    const prefixAndPass = prefix.concat(password, updateCurrentTime());

    const base64String = getBase64Data(prefixAndPass);

    try {
      let res =
        await connectedDevice?.device.writeCharacteristicWithResponseForService(
          SPS_SERVICE_UUID,
          SPS_SERVER_TX_UUID, // Use the appropriate UUID for writing
          base64String
        );

      return res;
      // Password set successfully
    } catch (error) {
      console.log("err in write temp", error);
      throw error;
      // Handle error while setting password
    }
  };

  const getStatusFromBase64AndSetToState = (statusData) => {
    const hexString = getDataFromArray(statusData);

    const password = hexString.slice(2, 6);
    const temperature = parseInt(hexString[6]);
    const temperatureMode = parseInt(hexString[7]);
    const lightStatus = parseInt(hexString[8]);
    const batteryLevel = parseInt(hexString[9]);
    const chargerStatus = parseInt(hexString[10]);
    const deviceStatus = parseInt(hexString[11]);
    const deviceLidOpen = parseInt(hexString[12]);

    setBoxTemp(temperature);
    setDevicePassword(password);
    setDeviceIsLocked(deviceStatus === 1 ? true : false);
    setDeviceIsLightsOn(lightStatus === 1 ? true : false);
    setBoxBatteryLevel(batteryLevel);
    setBoxIsCharging(chargerStatus === 1 ? true : false);
    if (temp.value < 0) {
      setTemp((prev) => ({ ...prev, value: temperature }));
    }
    console.log({
      password,
      temperature,
      temperatureMode,
      deviceStatus,
      batteryLevel,
      chargerStatus,
      lightStatus,
      deviceLidOpen,
    });
    return {
      password,
      temperature,
      temperatureMode,
      deviceStatus,
      batteryLevel,
      chargerStatus,
      lightStatus,
      deviceLidOpen,
    };
  };

  const getStatusFromDevice = async () => {
    try {
      const characteristic =
        await connectedDevice?.device.readCharacteristicForService(
          SPS_SERVICE_UUID,
          SPS_SERVER_RX_UUID // Use the appropriate UUID for reading
        );

      const data = getStatusFromBase64AndSetToState(characteristic.value);

      return data;
    } catch (error) {
      throw error;
      // Handle error while getting status
    }
  };

  const startMonitoringDevice = () => {
    console.log("monitoring");
    connectedDevice?.device?.monitorCharacteristicForService(
      SPS_SERVICE_UUID,
      SPS_SERVER_RX_UUID,
      (error, characteristic) => {
        if (error) {
          console.error("Error reading characteristic:", error.message);
          throw error;
        }
        getStatusFromBase64AndSetToState(characteristic.value);
      }
    );
  };

  useEffect(() => {
    if (connectedDevice?.device && !connectedDevice?.connecting) {
      getStatusFromDevice();
      startMonitoringDevice();
      connectedDevice?.device.onDisconnected(
        async (error, disconnectedDevice) => {
          setConnectedDevice((prev) => ({
            ...prev,
            connecting: false,
            isOwner: false,
            device: null,
          }));
          resetStat();
        }
      );
    }
  }, [connectedDevice]);

  return (
    <BleContext.Provider
      value={{
        device,
        setDevice,
        setScan,

        SPS_SERVICE_UUID,
        SPS_SERVER_TX_UUID,
        SPS_SERVER_RX_UUID,

        requestPermissions,
        scanForPeripherals,
        connectToDevice,
        disconnectFromDevice,
        stopScanning,

        scan,
        connectedDevice,

        writePasswordToDevice,
        writeLightsToDevice,
        writeTempToDevice,
        writeTempUnitToDevice,
        writeLockToggleToDevice,
        writeTimeToDevice,
        getStatusFromDevice,
        startMonitoringDevice,
      }}
    >
      {children}
    </BleContext.Provider>
  );
};

const useBleContext = () => useContext(BleContext);

export { BleProvider, useBleContext };
