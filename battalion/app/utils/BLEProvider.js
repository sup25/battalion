import React, { createContext, useState, useContext } from "react";
import { BleManager } from "react-native-ble-plx";

const BleContext = createContext();

const BleProvider = ({ children }) => {
  const [device, setDevice] = useState(null);
  const SPS_SERVICE_UUID = "6e410001b5a3f393e0a9e50e54dccaa0";
  const SPS_SERVER_TX_UUID = "6e410003b5a3f393e0a9e50e54dccaa0";
  const SPS_SERVER_RX_UUID = "6e410002b5a3f393e0a9e50e54dccaa0";

  return (
    <BleContext.Provider
      value={{
        device,
        setDevice,
        SPS_SERVICE_UUID,
        SPS_SERVER_TX_UUID,
        SPS_SERVER_RX_UUID,
      }}
    >
      {children}
    </BleContext.Provider>
  );
};

const useBleContext = () => useContext(BleContext);

export { BleProvider, useBleContext };
