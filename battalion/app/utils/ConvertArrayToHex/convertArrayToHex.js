const convertedArrayToHex = (array) =>
  array.map((value) => {
    let hexValue = value.toString(16); // Convert to hexadecimal

    // Ensure it has the "0x" prefix
    if (hexValue.length % 2 !== 0) {
      hexValue = "0" + hexValue;
    }

    hexValue = "0x" + hexValue.toUpperCase(); // Add "0x" prefix and ensure uppercase
    return hexValue;
  });

export default convertedArrayToHex;
