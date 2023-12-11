import {
  SPS_SERVER_RX_UUID,
  SPS_SERVER_TX_UUID,
  SPS_SERVICE_UUID,
} from "../constants";

import base64 from "react-native-base64";
import { encode } from "base-64";

/**
 * Sets the password on the connected BLE device.
 *
 * @async
 * @param {object} device - The connected device.
 * @param {number[]} password - The password as an array of bytes.
 * @returns {Promise<string>} A promise that resolves with a success message if the password is set successfully.
 * @throws {Error} Throws an error if there's an issue while setting the password.
 *
 * @example
 * // Set the password to [0x01, 0x02, 0x03, 0x04]
 * try {
 *   const result = await setPassword([0x01, 0x02, 0x03, 0x04]);
 *   console.log(result); // Output: "Password set successfully."
 * } catch (error) {
 *   console.error('Error setting password:', error);
 * }
 */

let test = true;
let preData = 1234;
export const setPasswordToDevice = async (device, password) => {
  const passwordData = preData; // assuming password is an array of bytes

  // Convert the byte value to a Uint8Array
  const byteArray = new Uint8Array(preData);

  // Convert the Uint8Array to a string
  const byteString = String.fromCharCode.apply(null, byteArray);

  // Encode the string to base64
  const encodedData = base64.encode(byteString);

  try {
    let res = await device.writeCharacteristicWithResponseForService(
      SPS_SERVICE_UUID,
      SPS_SERVER_RX_UUID, // Use the appropriate UUID for writing
      encodedData
    );
    if (test) {
      test = false;
      preData = [0x04, 0x05, 0x06, 0x07];
    } else {
      test = true;
      preData = [0x01, 0x02, 0x03, 0x04];
    }
    return res;
    // Password set successfully
  } catch (error) {
    throw error;
    // Handle error while setting password
  }
};

// Function to get status
export const getStatusFromDevice = async (device) => {
  try {
    const characteristic = await device.readCharacteristicForService(
      SPS_SERVICE_UUID,
      SPS_SERVER_RX_UUID // Use the appropriate UUID for reading
    );
    const statusData = characteristic.value;

    console.log("is it working?", base64.decode(statusData).charCodeAt(0));
    return base64.decode(statusData).charCodeAt(0);
  } catch (error) {
    throw error;
    // Handle error while getting status
  }
};

/**
 * Sets the time on the connected BLE device.
 *
 * @async
 * @param {number} hourH - The high byte of the hour (0-2).
 * @param {number} hourL - The low byte of the hour (0-9).
 * @param {number} minuteH - The high byte of the minute (0-5).
 * @param {number} minuteL - The low byte of the minute (0-9).
 * @param {number[]} password - The password as an array of 4 bytes.
 * @returns {Promise<void>} A promise that resolves once the time is set successfully.
 * @throws {Error} Throws an error if there's an issue while setting the time.
 *
 * @example
 * // Set the time to 13:34 with password 1234
 * try {
 *   await setTime(0x01, 0x03, 0x03, 0x04, [0x01, 0x02, 0x03, 0x04]);
 *   console.log('Time set successfully.');
 * } catch (error) {
 *   console.error('Error setting time:', error);
 * }
 */
export const setTimeToDevice = async (
  device,
  hourH,
  hourL,
  minuteH,
  minuteL,
  password
) => {
  const timeData = [hourH, hourL, minuteH, minuteL];
  const preData = [0x55, 0x02, ...password];

  const time = preData.concat(timeData); // assuming password is an array of bytes

  const binaryString = time.map((byte) => String.fromCharCode(byte)).join("");

  // Convert string to Base64
  const base64String = encode(binaryString);
  try {
    const res = await device.writeCharacteristicWithResponseForService(
      SPS_SERVICE_UUID,
      SPS_SERVER_TX_UUID, // Use the appropriate UUID for writing
      base64String
    );
    return res;
    // Time set successfully
  } catch (error) {
    throw error;
    // Handle error while setting time
  }
};
