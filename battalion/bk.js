// const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
// const defaultConfig = getDefaultConfig(__dirname);
// const { resolver, transformer } = defaultConfig;
// const { assetExts, sourceExts } = defaultConfig.resolver;
// /**
//  * Metro configuration
//  * https://reactnative.dev/docs/metro
//  *
//  * @type {import('metro-config').MetroConfig}
//  */
// const config = {
//   transformer: {
//     ...transformer, // <--- THIS WAS MISSING
//   },
//   resolver: {
//     ...resolver, // <--- THIS WAS MISSING
//     assetExts: assetExts.filter((ext) => ext !== "svg"),
//     sourceExts: [...sourceExts, "svg"],
//   },
// };
// module.exports = mergeConfig(defaultConfig, config);

// // Learn more https://docs.expo.io/guides/customizing-metro
// const { getDefaultConfig } = require("expo/metro-config");

// /** @type {import('expo/metro-config').MetroConfig} */
// const config = getDefaultConfig(__dirname);

// module.exports = config;
