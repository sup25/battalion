const convertedArrayToHex = (array) =>
  array.map((value) => "0x" + value.toString().padStart(2, "0"));

export default convertedArrayToHex;
