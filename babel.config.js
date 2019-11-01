module.exports = api => {
  api.cache(false);
  return {
    presets: ["module:metro-react-native-babel-preset"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "react-native-fluid-transitions": "./src/packages/transitions",
            "react-native-fluid-animations": "./src/packages/animated",
            "react-native-fluid-svg": "./src/packages/svg",
            "react-native-fluid-gestures": "./src/packages/gestures",
            "react-native-fluid-navigation": "./src/packages/navigation",
          },
        },
      ],
    ],
  };
};
