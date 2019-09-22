/* config-overrides.js */
const webpack = require("webpack");
const path = require("path");

module.exports = function override(config, env) {
  config.plugins.push(
    new webpack.DefinePlugin({
      __DEV__: true,
    }),
  );

  return config;
};
