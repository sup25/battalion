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
import convertedArrayToHex from "../ConvertArrayToHex/convertArrayToHex";
import { useAppSettingContext } from "../../context/AppSettingContext/AppSettingContext";
import appConfig from "../../config/app";

import { useToast } from "react-native-toast-notifications";
const BleContext = createContext();

const BleProvider = ({ children }) => {
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
    connecting: false,
  });
  const SPS_SERVICE_UUID = "19b10000-e8f2-537e-4f6c-d104768a1214";
  const SPS_SERVER_TX_UUID = "19b10001-e8f2-537e-4f6c-d104768a1214";
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

  const scanForPeripherals = async (toast = false, startTime = false) => {
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
      const services = await connectedDevice.services();
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
    const prefix = [55, 1];
    let passwordWithHeader = [];
    if (data) {
      if (data.length < 4) throw new Error("Password must be 4 digits");

      passwordWithHeader = Buffer.from(
        convertedArrayToHex(prefix.concat(data))
      );
    }
    console.log("dsasdasd", passwordWithHeader);

    try {
      let res =
        await connectedDevice.device.writeCharacteristicWithResponseForService(
          SPS_SERVICE_UUID,
          SPS_SERVER_TX_UUID, // Use the appropriate UUID for writing
          passwordWithHeader.toString("base64")
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
        await connectedDevice.device.writeCharacteristicWithResponseForService(
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
        await connectedDevice.device.writeCharacteristicWithResponseForService(
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
        await connectedDevice.device.writeCharacteristicWithResponseForService(
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
    const decodedBuffer = Buffer.from(statusData, "base64");

    // Extract the array of numbers from the Buffer
    const hexString = Array.from(decodedBuffer);
    console.log("hexString", hexString);
    const password = hexString.slice(2, 6);
    const temperature = parseInt(hexString.slice(6, 8));
    const deviceStatus = parseInt(hexString.slice(7, 9));
    const batteryLevel = parseInt(hexString.slice(8, 10));
    const chargerStatus = parseInt(hexString.slice(9, 11));
    const lightStatus = parseInt(hexString.slice(10, 12));

    setBoxTemp(temperature);
    setDevicePassword(password);
    setDeviceIsLocked(deviceStatus);
    setDeviceIsLightsOn(lightStatus);
    setBoxBatteryLevel(batteryLevel);
    setBoxIsCharging(chargerStatus);

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
        await connectedDevice.device.readCharacteristicForService(
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
    connectedDevice.device.monitorCharacteristicForService(
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
    if (connectedDevice.device && !connectedDevice.connecting) {
      getStatusFromDevice();
      startMonitoringDevice();
      connectedDevice.device.onDisconnected((error, disconnectedDevice) => {
        setConnectedDevice((prev) => ({ ...prev, device: null }));
        Toast.show("Device disconnected, please reconnect.", {
          type: "normal",
        });
      });
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
