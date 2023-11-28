import { useMemo, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from "react-native-ble-plx";

import * as ExpoDevice from "expo-device";

import base64 from "react-native-base64";

const HEART_RATE_UUID = "0000180d-0000-1000-8000-00805f9b34fb";
const HEART_RATE_CHARACTERISTIC = "00002a37-0000-1000-8000-00805f9b34fb";

// Battalion UUIDs
const SPS_SERVICE_UUID = "6e410001b5a3f393e0a9e50e54dccaa0";
const SPS_SERVER_TX_UUID = "6e410003b5a3f393e0a9e50e54dccaa0";
const SPS_SERVER_RX_UUID = "6e410002b5a3f393e0a9e50e54dccaa0";

function useBLE() {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [heartRate, setHeartRate] = useState(0);

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

  const isDuplicteDevice = (devices, nextDevice) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  let startTime = new Date();

  const scanForPeripherals = () => {
    setScanning(true);
    setAllDevices([]);

    bleManager.startDeviceScan(null, null, (error, device) => {
      endTime = new Date();
      var timeDiff = endTime - startTime; //in ms
      // strip the ms
      timeDiff /= 1000;
      // get seconds
      var seconds = Math.round(timeDiff);

      if (error) {
        console.log(error);
        setScanning(false);
      }
      if (device) {
        console.log(device);
        setScanning(false);
        setAllDevices((prevState) => {
          if (!isDuplicteDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
      console.log(seconds);
      if (seconds > 15) {
        bleManager.stopDeviceScan(); //stop scanning if more than 5 secs passed
      }
    });
  };

  const connectToDevice = async (device) => {
    console.log(device);
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      const connectedDevice =
        await deviceConnection.discoverAllServicesAndCharacteristics();
      const services = await connectedDevice.services();
      console.log(services);
      // Log the UUIDs of services
      services.forEach(async (service) => {
        console.log("Service UUID:", service.uuid);

        // Log the UUIDs of characteristics
        const characteristics = await service.characteristics();
        characteristics.forEach((characteristic) => {
          console.log("Characteristic UUID:", characteristic.uuid);
        });
      });
      bleManager.stopDeviceScan();
      return;
      // startStreamingData(deviceConnection);
    } catch (e) {
      console.log("FAILED TO CONNECT", e);
      return e;
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.stopDeviceScan();
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      setHeartRate(0);
    }
  };

  const onHeartRateUpdate = (error, characteristic) => {
    console.log(characteristic);
    if (error) {
      console.log(error);
      return -1;
    } else if (!characteristic?.value) {
      console.log("No Data was recieved");
      return -1;
    }

    const rawData = base64.decode(characteristic.value);
    let innerHeartRate = -1;

    const firstBitValue = Number(rawData) & 0x01;

    if (firstBitValue === 0) {
      innerHeartRate = rawData[1].charCodeAt(0);
    } else {
      innerHeartRate =
        Number(rawData[1].charCodeAt(0) << 8) +
        Number(rawData[2].charCodeAt(2));
    }
    setHeartRate(innerHeartRate);
  };

  const startStreamingData = async (device) => {
    if (device) {
      device.monitorCharacteristicForService(
        HEART_RATE_UUID,
        HEART_RATE_CHARACTERISTIC,
        onHeartRateUpdate
      );
    } else {
      console.log("No Device Connected");
    }
  };

  const stopScanning = () => {
    bleManager.stopDeviceScan();
  };

  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
    heartRate,
    scanning,
    stopScanning,
  };
}

export default useBLE;
