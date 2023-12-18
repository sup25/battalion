import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  useEffect,
} from "react";
import { BleManager } from "react-native-ble-plx";
import * as ExpoDevice from "expo-device";
import { PermissionsAndroid, Platform } from "react-native";
import { Buffer } from "buffer";
import base64 from "react-native-base64";
import convertedArrayToHex from "./convertArrayToHex";
import { useAppSettingContext } from "../context/AppSettingContext";
const BleContext = createContext();

const BleProvider = ({ children }) => {
  const {
    setBoxTemp,
    setBoxBatteryLevel,
    setBoxIsCharging,
    setDevicePassword,
    setDeviceIsLocked,
    setDeviceIsLightsOn,
  } = useAppSettingContext();
  const bleManager = useMemo(() => new BleManager(), []);

  const [device, setDevice] = useState(null);
  const [scan, setScan] = useState({
    scanning: true,
    devices: [
      { name: "test", id: "test" },
      { name: "test2", id: "test2" },
    ],
    error: null,
  });
  const [connectedDevice, setConnectedDevice] = useState({
    device: null,
    error: null,
    connecting: false,
  });
  const SPS_SERVICE_UUID = "19b10000-e8f2-537e-4f6c-d104768a1214";
  const SPS_SERVER_TX_UUID = "6e410002-b5a3-f393-e0a9-e50e54dccaa0";
  const SPS_SERVER_RX_UUID = "19b10001-e8f2-537e-4f6c-d104768a1214";
  // const SPS_SERVICE_UUID = "6e410001-b5a3-f393-e0a9-e50e54dccaa0";
  // const SPS_SERVER_TX_UUID = "6e410002-b5a3-f393-e0a9-e50e54dccaa0";
  // const SPS_SERVER_RX_UUID = "6e410003-b5a3-f393-e0a9-e50e54dccaa0";

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

  const scanForPeripherals = (setError = false, startTime = false) => {
    bleManager.startDeviceScan(
      null,
      // [SPS_SERVICE_UUID],
      { allowDuplicates: false },
      (error, device) => {
        setError();
        if (startTime) {
          endTime = new Date();
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

          setError(error.message);
          bleManager.stopDeviceScan();
          seconds = 19;
          return { error };
        }
        if (device) {
          setError();
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
            setError();
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
      const services = await connectedDevice.services();
      // Log the UUIDs of services
      services.forEach(async (service) => {
        // Log the UUIDs of characteristics
        console.log(service);
        const characteristics = await service.characteristics();
        characteristics.forEach((characteristic) => {
          console.log(characteristic);
        });
      });
      setConnectedDevice((prev) => ({
        ...prev,
        device: deviceConnection,
        connecting: false,
      }));
      return deviceConnection;
    } catch (e) {
      setConnectedDevice((prev) => ({
        ...prev,
        error: e.message,
        connecting: false,
      }));
      console.log("FAILED TO CONNECT", e);
      throw e;
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice.device) {
      bleManager.stopDeviceScan();
      bleManager.cancelDeviceConnection(connectedDevice.device.id);
      setConnectedDevice((prev) => ({ ...prev, device: null }));
    }
  };

  const stopScanning = () => {
    setScan((prev) => ({ ...prev, scanning: false }));
    bleManager.stopDeviceScan();
  };

  const writePasswordToDevice = async (data = false) => {
    const prefix = [55, 5];
    let passwordWithHeader = Buffer.from(
      convertedArrayToHex([55, 5, 5, 9, 7, 6, 15, 0, 65, 0, 1])
    );
    if (data) {
      if (data.length < 4) throw new Error("Password must be 4 digits");

      passwordWithHeader = Buffer.from(
        convertedArrayToHex(prefix.concat(data))
      );
    }

    try {
      let res =
        await connectedDevice.device.writeCharacteristicWithResponseForService(
          SPS_SERVICE_UUID,
          SPS_SERVER_RX_UUID, // Use the appropriate UUID for writing
          passwordWithHeader.toString("base64")
        );
      console.log("res", res);
      return res;
      // Password set successfully
    } catch (error) {
      console.log("err in write password", error);
      throw error;
      // Handle error while setting password
    }
  };

  const getStatusFromDevice = async () => {
    console.log("connected device", connectedDevice.device);
    try {
      const characteristic =
        await connectedDevice.device.readCharacteristicForService(
          SPS_SERVICE_UUID,
          SPS_SERVER_RX_UUID // Use the appropriate UUID for reading
        );
      // characteristic.value coming from ble device is 0x5505010203040200640001
      const statusData = characteristic.value;
      console.log("data", statusData);
      const hexString = Buffer.from(statusData, "base64").toString("hex");
      console.log(hexString);
      // Extract individual components from the original hex string directly
      const prefix = hexString.slice(0, 4);
      const password = hexString.slice(4, 12);
      const temperature = parseInt(hexString.slice(12, 14));
      const deviceStatus = parseInt(hexString.slice(14, 16));
      const batteryLevel = parseInt(hexString.slice(16, 18));
      const chargerStatus = parseInt(hexString.slice(18, 20));
      const lightStatus = parseInt(hexString.slice(20, 22));

      const passwordArray = [];
      for (let i = 0; i < password.length; i += 2) {
        const pair = password.substring(i, i + 2);
        const number = parseInt(pair, 16); // Parse the pair as a hexadecimal number
        passwordArray.push(number);
      }

      setBoxTemp(temperature);
      setDevicePassword(passwordArray);
      setDeviceIsLocked(deviceStatus);
      setDeviceIsLightsOn(lightStatus);
      setBoxBatteryLevel(batteryLevel);
      setBoxIsCharging(chargerStatus);
      console.log({
        prefix,
        password: passwordArray,
        temperature,
        deviceStatus,
        batteryLevel,
        chargerStatus,
        lightStatus,
      });
      return characteristic;
    } catch (error) {
      throw error;
      // Handle error while getting status
    }
  };

  const startMonitoringDevice = () => {
    console.log("monitoring");
    connectedDevice.device.monitorCharacteristicForService(
      SPS_SERVICE_UUID,
      SPS_SERVER_RX_UUID,
      (error, characteristic) => {
        if (error) {
          console.error("Error reading characteristic:", error.message);
          return;
        }
        const statusData = characteristic.value;
        console.log("data", statusData);
        const hexString = Buffer.from(statusData, "base64").toString("hex");

        const password = hexString.slice(4, 12);
        const temperature = parseInt(hexString.slice(12, 14));
        const deviceStatus = parseInt(hexString.slice(14, 16));
        const batteryLevel = parseInt(hexString.slice(16, 18));
        const chargerStatus = parseInt(hexString.slice(18, 20));
        const lightStatus = parseInt(hexString.slice(20, 22));

        const passwordArray = [];
        for (let i = 0; i < password.length; i += 2) {
          const pair = password.substring(i, i + 2);
          const number = parseInt(pair, 16); // Parse the pair as a hexadecimal number
          passwordArray.push(number);
        }

        setBoxTemp(temperature);
        setDevicePassword(passwordArray);
        setDeviceIsLocked(deviceStatus);
        setDeviceIsLightsOn(lightStatus);
        setBoxBatteryLevel(batteryLevel);
        setBoxIsCharging(chargerStatus);

        console.log({
          password: passwordArray,
          temperature,
          deviceStatus,
          batteryLevel,
          chargerStatus,
          lightStatus,
        });
      }
    );
  };
  useEffect(() => {
    if (connectedDevice.device && !connectedDevice.connecting) {
      startMonitoringDevice();
    }
  }, [connectedDevice]);
  return (
    <BleContext.Provider
      value={{
        device,
        setDevice,

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
