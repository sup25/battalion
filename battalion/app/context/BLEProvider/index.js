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
import { useAppSettingContext } from "../AppSettingProvider";
import appConfig from "../../config/app";
import {
  checkIfUserIsOwner,
  checkIfUserHasPermissionToConnect,
} from "../../api/devices";
import { useToast } from "react-native-toast-notifications";
import { useAuth } from "../AuthProvider";
import { useNavigation } from "@react-navigation/native";

const BleContext = createContext();

const BleProvider = ({ children }) => {
  const SPS_SERVICE_UUID = "19b10000-e8f2-537e-4f6c-d104768a1214";
  const SPS_SERVER_TX_UUID = "19B10001-E8F2-537E-4F6C-D104768A1214";
  const SPS_SERVER_RX_UUID = "19B10002-E8F2-537E-4F6C-D104768A1214";
  // const SPS_SERVICE_UUID = "6e410001-b5a3-f393-e0a9-e50e54dccaa0";
  // const SPS_SERVER_TX_UUID = "6e410002-b5a3-f393-e0a9-e50e54dccaa0";
  // const SPS_SERVER_RX_UUID = "6e410003-b5a3-f393-e0a9-e50e54dccaa0";

  const navigation = useNavigation();

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
    setConnectedDevice: setConnectedDeviceState,
    setDevicesIdsBasedOnSerialNum,
  } = useAppSettingContext();
  const bleManager = useMemo(() => new BleManager(), []);

  const { currentUser } = useAuth();

  const [device, setDevice] = useState(null);
  const [scan, setScan] = useState({
    scanning: false,
    devices: [],
    error: null,
  });
  const [connectedDevice, setConnectedDevice] = useState({
    device: null,
    error: null,
    isOwner: false,
    hasPassword: false,
    connecting: true,
  });

  useEffect(() => {
    if (connectedDevice?.device) {
      setConnectedDeviceState(connectedDevice?.device);
    }
  }, [connectedDevice]);

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
    const serialNum = await AsyncStorage.getItem("combinedSerialNum");
    if (
      currentUser &&
      navigation.getState().routes?.[0]?.state?.routes?.[0]?.name === "MainTabs"
    ) {
      const storedDevices = await getItemFromAsyncStorage(
        "appSettings",
        "connectedDevices"
      );

      const storedDeviceId = storedDevices.find((d) => d.connected);
      if (storedDeviceId) {
        Toast.show(
          `Trying to reconnect to the device (${storedDeviceId?.name}).`,
          {
            type: "normal",
          }
        );
        try {
          await connectToDevice(storedDeviceId?.device, serialNum);
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
            hasPassword: false,
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
          hasPassword: false,
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
    if (
      currentUser &&
      navigation.getState()?.routes?.[0]?.state?.routes?.[0]?.name ===
        "MainTabs"
    ) {
      const serialNum = await AsyncStorage.getItem("combinedSerialNum");
      setConnectedDevice((prev) => ({
        ...prev,
        device: null,
        hasPassword: false,
        connecting: true,
      }));
      // Check app state changes and manage BLE connections accordingly
      if (nextAppState === "active") {
        // App has come to the foreground, attempt reconnection if needed
        const storedDevices = await getItemFromAsyncStorage(
          "appSettings",
          "connectedDevices"
        );
        const storedDeviceId = storedDevices.find((d) => d.connected);

        if (storedDeviceId) {
          Toast.show("Reconnecting to the device.", {
            type: "normal",
          });

          try {
            await connectToDevice(storedDeviceId?.device, serialNum);
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
              hasPassword: false,
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
            hasPassword: false,
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
      devices: [],
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
            devices: [],
            error: error.message,
            scanning: false,
          }));

          bleManager.stopDeviceScan();
          seconds = 19;
          if (error.message !== "Bluetooth is powered off") {
            toast.show(
              "Error scanning for devices, Bluetooth is off, turn it on and try again",
              {
                type: "normal",
                placement: "bottom",
              }
            );
          } else {
            toast.show(
              "Error scanning for devices, check if blutooth is on and try again",
              {
                type: "normal",
                placement: "bottom",
              }
            );
          }
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
            bleManager.stopDeviceScan(); //stop scanning if more than 18 secs passed
          }
        }
      }
    );
  };

  const connectToDevice = async (
    device,
    deviceSerialNumber = false,
    password
  ) => {
    console.log("connecting to device", device);
    setConnectedDevice((prev) => ({ ...prev, connecting: true }));
    bleManager.stopDeviceScan();
    let setTimeOut = setTimeout(async () => {
      await bleManager.cancelDeviceConnection(device.id);
      setConnectedDevice(() => ({
        device: null,
        isOwner: false,
        hasPassword: false,
        error: "Connection timeout",
        connecting: false,
      }));
      clearTimeout(setTimeOut);
      Toast.show("Timeout, failed to connect");
      throw new Error("Connection timeout");
    }, 15000);
    try {
      const deviceFromDb = await checkIfUserHasPermissionToConnect(
        currentUser.uid,
        deviceSerialNumber
      );
      if (!deviceFromDb) {
        setConnectedDevice({
          device: null,
          isOwner: false,
          hasPassword: false,
          error: "You don't have permission to connect to this device",
          connecting: false,
        });
        Toast.show("You don't have permission to connect to this device");
        throw new Error("You don't have permission to connect to this device");
      }
      setBoxNameValue(deviceFromDb.name);
      const isOwner = await checkIfUserIsOwner(
        currentUser.uid,
        deviceSerialNumber
      );

      const deviceConnection = await bleManager.connectToDevice(device.id);

      const connectedDevice =
        await deviceConnection.discoverAllServicesAndCharacteristics();
      await connectedDevice?.services();
      if (deviceSerialNumber) {
        deviceConnection.serialNum = deviceSerialNumber;
        await AsyncStorage.setItem("combinedSerialNum", deviceSerialNumber);
      }

      setConnectedDevice({
        error: null,
        device: deviceConnection,
        hasPassword: deviceFromDb?.fourDigitCode ? true : false,
        isOwner: isOwner,
        connecting: false,
      });
      await monitoringDevice(deviceFromDb?.fourDigitCode, deviceConnection);
      await setDevicesIdsBasedOnSerialNum(deviceSerialNumber, device.id);

      deviceConnection.onDisconnected(async (error, disconnectedDevice) => {
        setBoxNameValue("");
        setConnectedDevice((prev) => ({
          ...prev,
          connecting: false,
          isOwner: false,
          hasPassword: false,
          device: null,
        }));
        resetStat();
      });
      clearTimeout(setTimeOut);
      return deviceConnection;
    } catch (e) {
      clearTimeout(setTimeOut);
      setConnectedDevice({
        device: null,
        error: e.message,
        isOwner: false,
        hasPassword: false,
        connecting: false,
      });

      console.log("FAILED TO CONNECT", e);
      throw e;
    }
  };

  const disconnectFromDevice = async (showToast = false) => {
    if (connectedDevice?.device) {
      bleManager.stopDeviceScan();
      await bleManager.cancelDeviceConnection(connectedDevice?.device.id);
      setConnectedDevice((prev) => ({
        ...prev,
        isOwner: false,
        hasPassword: false,
        device: null,
      }));
      if (showToast) {
        Toast.show("Device disconnected", {
          type: "normal",
        });
      }
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
    let bufferData = Buffer.from(data);

    // Convert to hex
    const hexString = bufferData.toString("hex");
    // Convert hex to base64
    const base64String = Buffer.from(hexString, "hex").toString("base64");

    return base64String;
  };
  const getDataFromArray = (base64Data) => {
    // Convert base64 to hex
    const hexString = Buffer.from(base64Data, "base64").toString("hex");
    // Convert hex to buffer
    const bufferData = Buffer.from(hexString, "hex");
    // Convert buffer to data array in base 10
    const dataArray = Array.from(bufferData);
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
        await connectedDevice?.device?.writeCharacteristicWithoutResponseForService(
          SPS_SERVICE_UUID,
          SPS_SERVER_TX_UUID, // Use the appropriate UUID for writing
          base64String
        );

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
  const writeTempToDevice = async (temprature, lights) => {
    const prefix = [85, 3];
    const data = prefix.concat(
      password,
      [temprature.value],
      [temprature.unit === "c" ? 0 : 1],
      [lights ? 1 : 0]
    );

    const base64String = getBase64Data(data);

    try {
      let res =
        await connectedDevice?.device?.writeCharacteristicWithoutResponseForService(
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

  const writeTempUnitToDevice = async (temprature, mode, lights) => {
    const prefix = [85, 3];
    const data = prefix.concat(
      password,
      [temprature.value],
      [mode === "c" ? 1 : 0],
      [lights ? 1 : 0]
    );

    const base64String = getBase64Data(data);

    try {
      let res =
        await connectedDevice?.device?.writeCharacteristicWithoutResponseForService(
          SPS_SERVICE_UUID,
          SPS_SERVER_TX_UUID,
          base64String
        );

      return res;
    } catch (error) {
      console.log("err in write temp", error);
      throw error;
    }
  };

  /**
   *
   * @param {number} lightsState - 0 for off, 1 for on (auto)
   * @returns
   */
  const writeLightsToDevice = async (lightsState, temprature) => {
    const prefix = [85, 3];
    const data = prefix.concat(
      password,
      [temprature.value],
      [temprature.unit === "c" ? 0 : 1],
      [lightsState]
    );

    const base64String = getBase64Data(data);

    try {
      let res =
        await connectedDevice?.device?.writeCharacteristicWithoutResponseForService(
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
    console.log(prefixAndPass, "prefixAndPass");
    const base64String = getBase64Data(prefixAndPass);

    try {
      let res =
        await connectedDevice?.device?.writeCharacteristicWithoutResponseForService(
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
  const writeTimeToDevice = async (device) => {
    const prefix = [85, 2];
    const prefixAndPass = prefix.concat(password, updateCurrentTime());

    const base64String = getBase64Data(prefixAndPass);

    try {
      let res = await device?.writeCharacteristicWithoutResponseForService(
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

  const setToState = (value, setState, checkForBoolen, status) => {
    const finalVal = checkForBoolen ? (value === 1 ? true : false) : value;
    if (value && !Number.isNaN(value)) {
      setState(finalVal);
    }
  };
  const getStatusFromBase64AndSetToState = async (statusData) => {
    const hexString = getDataFromArray(statusData);
    if (hexString.length < 16) {
      return false;
    }
    console.log(hexString, "hexString");
    const password = hexString.slice(2, 6);
    const temperature = parseInt(hexString[6]);
    const temperatureMode = parseInt(hexString[7]);
    const lightStatus = parseInt(hexString[8]);
    const batteryLevel = parseInt(hexString[9]);
    const chargerStatus = parseInt(hexString[10]);
    const deviceStatus = parseInt(hexString[11]);
    const deviceLidOpen = parseInt(hexString[12]);
    setToState(temperature, setBoxTemp, false);
    setToState(password, setDevicePassword);
    setToState(deviceStatus, setDeviceIsLocked, true);
    setToState(lightStatus, setDeviceIsLightsOn, true);
    setToState(batteryLevel, setBoxBatteryLevel);
    setToState(chargerStatus, setBoxIsCharging, true, "chargerStatus");

    if (temperatureMode && !Number.isNaN(temperatureMode)) {
      setTemp((prev) => ({ ...prev, unit: temperatureMode === 1 ? "f" : "c" }));
    }
    if (temperature && !Number.isNaN(temperature) && temp.value < 0) {
      setTemp((prev) => ({ ...prev, value: temperature }));
    }
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

  const getStatusFromDevice = async (pass = false, device = false) => {
    let currentDevice = device || connectedDevice?.device;
    const prefix = [85, 5];
    const prefixAndPass = prefix.concat(
      password && password?.length > 0 ? password : pass
    );
    const base64String = getBase64Data(prefixAndPass);

    try {
      let res = await currentDevice?.writeCharacteristicWithResponseForService(
        SPS_SERVICE_UUID,
        SPS_SERVER_TX_UUID, // Use the appropriate UUID for writing
        base64String
      );

      // await getStatusFromBase64AndSetToState(res.value);

      // Password set successfully
    } catch (error) {
      console.log("err in getting status", error);
      throw error;
      // Handle error while setting password
    }
  };

  const startMonitoringDevice = async (device = false) => {
    let currentDevice = device || connectedDevice?.device;
    currentDevice.monitorCharacteristicForService(
      SPS_SERVICE_UUID,
      SPS_SERVER_RX_UUID,
      async (error, characteristic) => {
        if (error) {
          console.error("Error reading characteristic:", error.message);
          throw error;
        }

        try {
          await getStatusFromBase64AndSetToState(characteristic.value);
        } catch (err) {
          console.log(err);
        }
      }
    );
  };

  const monitoringDevice = async (pass, device) => {
    console.log("monitoring");
    try {
      await startMonitoringDevice(device);
      await getStatusFromDevice(pass, device);
      await writeTimeToDevice(device);
    } catch (e) {
      console.log("error in monitoring", e);
    }
  };

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
