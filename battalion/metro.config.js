// Learn more https://docs.expo.io/guides/customizing-metrocconst { getDefaultConfig } = require('expo/metro-config');

const { getDefaultConfig } = require("@expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
module.exports = config;
