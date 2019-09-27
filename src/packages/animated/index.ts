import { IAnimationProvider } from "./src/Types/IAnimationProvider";
import { NativeModules } from "react-native";

const _renimatedAvailable =
  // false &&
  NativeModules !== undefined && NativeModules.ReanimatedModule !== undefined;

console.log(
  `**** Render engine ${
    _renimatedAvailable ? "react-native-reanimated" : "React Native Animated"
  }`,
);
export const AnimationProvider: IAnimationProvider = _renimatedAvailable
  ? require("./src/react-native-reanimated").ReanimatedAnimationProvider
  : require("./src/react-native-animated").ReactNativeAnimationProvider;

export * from "./src/Types";
