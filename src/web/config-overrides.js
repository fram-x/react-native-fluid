/* config-overrides.js */
const webpack = require("webpack");

module.exports = function override(config, env) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      "react-native-fluid-animations": "../packages/animated",
      "react-native-fluid-transitions": "../packages/transitions",
    },
  };
  config.plugins.push(
    new webpack.DefinePlugin({
      __DEV__: true,
    }),
  );
  return config;
};
