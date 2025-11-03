// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

/** For Drizzle ORM + Expo sqlite */
config.resolver.sourceExts.push("sql");

module.exports = config;
