/**
 * Sets the password on the connected BLE device.
 *
 * @async
 * @param {object} ble - The ble object from useBleContext.
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
export const setPasswordToDevice = async (ble, password) => {
  const passwordData = [0x55, 0x01, ...password]; // assuming password is an array of bytes

  try {
    let res = await ble.device.writeCharacteristicWithResponseForService(
      ble.SPS_SERVICE_UUID,
      ble.SPS_SERVER_TX_UUID, // Use the appropriate UUID for writing
      passwordData
    );
    return res;
    // Password set successfully
  } catch (error) {
    throw error;
    // Handle error while setting password
  }
};

// Function to get status
export const getStatusFromDevice = async (ble) => {
  try {
    const characteristic = await ble.device.readCharacteristicForService(
      ble.SPS_SERVICE_UUID,
      ble.SPS_SERVER_RX_UUID // Use the appropriate UUID for reading
    );
    const statusData = characteristic.value;
    return characteristic;
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
  ble,
  hourH,
  hourL,
  minuteH,
  minuteL,
  password
) => {
  const timeData = [0x55, 0x02, ...password, hourH, hourL, minuteH, minuteL];

  try {
    const res = await ble.device.writeCharacteristicWithResponseForService(
      ble.SPS_SERVICE_UUID,
      ble.SPS_SERVER_TX_UUID, // Use the appropriate UUID for writing
      timeData
    );
    return res;
    // Time set successfully
  } catch (error) {
    throw error;
    // Handle error while setting time
  }
};
