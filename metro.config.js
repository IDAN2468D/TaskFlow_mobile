const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require("nativewind/metro");
const path = require('path');
const config = getDefaultConfig(__dirname);

config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs'];
config.resolver.assetExts = [...config.resolver.assetExts];
config.resolver.unstable_enablePackageExports = true;

// Alias reanimated to our fixed version
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'react-native-reanimated': path.resolve(__dirname, 'src/utils/reanimated-fixed.ts'),
};

module.exports = withNativeWind(config, { input: "./src/styles/global.css" });

