const convertedArrayToHex = (array) =>
  array.map((value) => {
    return value.toString().padStart(2, "0");
  });

export default convertedArrayToHex;
