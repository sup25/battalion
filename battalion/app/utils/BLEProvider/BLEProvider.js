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
import base64 from "react-native-base64";
import { btoa, atob } from "react-native-quick-base64";
import convertedArrayToHex from "../ConvertArrayToHex/convertArrayToHex";
import { useAppSettingContext } from "../../context/AppSettingContext/AppSettingContext";
import appConfig from "../../config/app";

import { useToast } from "react-native-toast-notifications";
const BleContext = createContext();

const BleProvider = ({ children }) => {
  const SPS_SERVICE_UUID = "19b10000-e8f2-537e-4f6c-d104768a1214";
  const SPS_SERVER_TX_UUID = "19b10001-e8f2-537e-4f6c-d104768a1214";
  const SPS_SERVER_RX_UUID = "19b10001-e8f2-537e-4f6c-d104768a1214";
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
    isLightsOn,
  } = useAppSettingContext();
  const bleManager = useMemo(() => new BleManager(), []);

  const [device, setDevice] = useState(null);
  const [scan, setScan] = useState({
    scanning: false,
    devices,
    error: null,
  });
  const [connectedDevice, setConnectedDevice] = useState({
    device: null,
    error: null,
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
    Toast.show("Reconnecting to the device.", {
      type: "normal",
    });
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
      }
    }
  };

  useEffect(() => {
    connectToDeviceOnStart();
    // Add listeners for app background/foreground events to handle BLE connection states
    AppState.addEventListener("change", handleAppStateChange);

    // return () => {
    //   // Remove listeners on component unmount
    //   AppState.removeEventListener("change", handleAppStateChange);
    // };
  }, []);

  const handleAppStateChange = async (nextAppState) => {
    Toast.show("Reconnecting to the device.", {
      type: "normal",
    });
    // Check app state changes and manage BLE connections accordingly
    if (nextAppState === "active") {
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
        }
      }
    } else {
      // App is in the background or inactive, handle disconnection or suspend operations
      // Disconnect or perform necessary actions when app goes to background
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
          toast.show("Error scanning for devices, check if blutooth is on.", {
            type: "normal",
            placement: "bottom",
          });
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
      const deviceConnection = await bleManager.connectToDevice(device.id, {
        autoConnect: true,
        refreshGatt: "OnConnected",
      });

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
        connecting: false,
      }));
      console.log("connected!", deviceConnection.id, deviceConnection.name);
      return deviceConnection;
    } catch (e) {
      setConnectedDevice((prev) => ({
        device: null,
        error: e.message,
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
      setConnectedDevice((prev) => ({ ...prev, device: null }));
    }
  };

  const stopScanning = () => {
    setScan((prev) => ({ ...prev, scanning: false }));
    bleManager.stopDeviceScan();
  };

  const writePasswordToDevice = async (data = false) => {
    const prefix = [55, 1];
    let passwordWithHeader = [];
    if (data) {
      if (data.length < 4) throw new Error("Password must be 4 digits");

      passwordWithHeader = Buffer.from(
        convertedArrayToHex(prefix.concat(data))
      );
    }
    const dataTest = [55, 1, 1, 2, 3, 4];
    const dataBase64 = btoa(String.fromCharCode.apply(null, data));
    const dataBase64Test = btoa(dataTest.join(""));
    console.log("teete", dataBase64Test);
    console.log(String.fromCharCode.apply(null, data), dataTest.join(""));
    const test2 = Buffer.from(dataTest).toString("base64");
    const test3 = base64.encode(dataTest.join(""));
    const test4 = Buffer.from("550101020304", "hex").toString("base64");
    console.log("1", dataBase64);
    console.log("2", test2);
    console.log("3", test3);
    console.log("4", test4);
    console.log("decode1", base64.decode(dataBase64));
    console.log("decode2", base64.decode(test2));
    console.log("decode3", base64.decode(test3));
    console.log("decode4", base64.decode(test4));
    try {
      let res =
        await connectedDevice?.device.writeCharacteristicWithResponseForService(
          SPS_SERVICE_UUID,
          SPS_SERVER_TX_UUID, // Use the appropriate UUID for writing
          dataBase64
        );

      return res;
      // Password set successfully
    } catch (error) {
      console.log("err in write password", error);
      throw error;
      // Handle error while setting password
    }
  };

  const writeLightsToDevice = async (data = false) => {
    const prefix = [55, 3];
    const prefixAndPass = prefix.concat(password);
    const withTemp = prefixAndPass.concat([temp.value]);
    let lightsWithPrefix = [];
    if (data) {
      lightsWithPrefix = Buffer.from(
        convertedArrayToHex(withTemp.concat(data))
      );
    }

    try {
      let res =
        await connectedDevice?.device.writeCharacteristicWithResponseForService(
          SPS_SERVICE_UUID,
          SPS_SERVER_TX_UUID, // Use the appropriate UUID for writing
          lightsWithPrefix.toString("base64")
        );

      return res;
      // Password set successfully
    } catch (error) {
      console.log("err in write lights", error);
      throw error;
      // Handle error while setting password
    }
  };

  const writeTempToDevice = async (data = false) => {
    const prefix = [55, 3];
    const prefixAndPass = prefix.concat(password);
    const withTemp = prefixAndPass.concat([isLightsOn ? 1 : 0]);
    let tempWithPrefix = [];
    if (data) {
      tempWithPrefix = Buffer.from(convertedArrayToHex(withTemp.concat(data)));
    }

    try {
      let res =
        await connectedDevice?.device.writeCharacteristicWithResponseForService(
          SPS_SERVICE_UUID,
          SPS_SERVER_TX_UUID, // Use the appropriate UUID for writing
          tempWithPrefix.toString("base64")
        );

      return res;
      // Password set successfully
    } catch (error) {
      console.log("err in write temp", error);
      throw error;
      // Handle error while setting password
    }
  };

  const writeLockToDevice = async (data = false) => {
    const prefix = [55, 4];
    const prefixAndPass = prefix.concat(password);
    let lockWithPrefix = [];
    if (data) {
      lockWithPrefix = Buffer.from(
        convertedArrayToHex(prefixAndPass.concat(data))
      );
    }

    try {
      let res =
        await connectedDevice?.device.writeCharacteristicWithResponseForService(
          SPS_SERVICE_UUID,
          SPS_SERVER_TX_UUID, // Use the appropriate UUID for writing
          lockWithPrefix.toString("base64")
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
    const data = Buffer.from(base64.decode(statusData)).toString("utf-8");
    console.log("statusData", statusData);

    // Extract the array of numbers from the Buffer
    const hexString = Array.from(data);
    console.log("hexString", hexString);
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

    console.log({
      password,
      temperature,
      deviceStatus,
      batteryLevel,
      chargerStatus,
      lightStatus,
    });
  };

  const getStatusFromDevice = async () => {
    console.log("getting status");
    try {
      const characteristic =
        await connectedDevice?.device.readCharacteristicForService(
          SPS_SERVICE_UUID,
          SPS_SERVER_RX_UUID // Use the appropriate UUID for reading
        );

      getStatusFromBase64AndSetToState(characteristic.value);

      return characteristic;
    } catch (error) {
      throw error;
      // Handle error while getting status
    }
  };

  const startMonitoringDevice = () => {
    console.log("monitoring");
    connectedDevice?.device.monitorCharacteristicForService(
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
  let isFirstTime = true;
  useEffect(() => {
    if (connectedDevice?.device && !connectedDevice?.connecting) {
      getStatusFromDevice();
      startMonitoringDevice();
      connectedDevice?.device.onDisconnected(
        async (error, disconnectedDevice) => {
          setConnectedDevice((prev) => ({
            ...prev,
            connecting: false,
            device: null,
          }));
          if (isFirstTime) {
            isFirstTime = false;
            try {
              await connectToDevice(disconnectedDevice);
              Toast.show("Device reconnected successfuly.", {
                type: "normal",
              });
            } catch (e) {
              Toast.show("Couldn't reconnect to device.", {
                type: "normal",
              });
            }
          }
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
        writeLockToDevice,
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
