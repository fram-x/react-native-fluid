import {
  // @ts-ignore
  ConfigStateType,
  useFluidConfig,
} from "react-native-fluid-transitions";
import { NavigationState } from "../types";
import { safeGetState } from "../Functions";

export const useFadeConfig = (states: ConfigStateType[]) => {
  const forwardTo = safeGetState(NavigationState.ForwardTo, states);
  const forwardFrom = safeGetState(NavigationState.ForwardFrom, states);
  const backTo = safeGetState(NavigationState.BackTo, states);
  const backFrom = safeGetState(NavigationState.BackFrom, states);

  const config = useFluidConfig({
    when: [
      {
        state: forwardTo,
        interpolation: [
          {
            styleKey: "opacity",
            inputRange: [0, 0.45, 0.5, 1],
            outputRange: [0, 0, 1, 1],
          },
        ],
      },
      {
        state: forwardFrom,
        interpolation: [
          {
            styleKey: "opacity",
            inputRange: [0, 0.45, 0.55, 1],
            outputRange: [1, 1, 0, 0],
          },
        ],
      },
      {
        state: backFrom,
        interpolation: [
          {
            styleKey: "opacity",
            inputRange: [0, 0.45, 0.55, 1],
            outputRange: [1, 1, 0, 0],
          },
        ],
      },
      {
        state: backTo,
        interpolation: [
          {
            styleKey: "opacity",
            inputRange: [0, 0.45, 0.55, 1],
            outputRange: [0, 0, 1, 1],
          },
        ],
      },
    ],
  });
  return config;
};
