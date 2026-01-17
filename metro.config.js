const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add ppn to asset extensions
config.resolver.assetExts.push('ppn');

module.exports = config;
