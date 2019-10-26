import { useContext } from "react";
import { StateContext, useFluidConfig } from "react-native-fluid-transitions";
import { createWhenConfiguration } from "./createNavigationTransition";
// @ts-ignore
import { ConfigWhenType } from "react-native-fluid-transitions";
import { ConfigType } from "react-native-fluid-transitions";

export const useNavigationTransition = (
  styleKey: string,
  inputRange: Array<number>,
  outputRangeForwardFrom: Array<number | string>,
  outputRangeForwardTo: Array<number | string>,
  outputRangeBackFrom: Array<number | string>,
  outputRangeBackTo: Array<number | string>,
): ConfigType => {
  const stateContext = useContext(StateContext);
  if (!stateContext) {
    throw Error("State context is missing");
  }

  return useFluidConfig({
    when: createWhenConfiguration(
      stateContext.states,
      styleKey,
      inputRange,
      outputRangeForwardFrom,
      outputRangeForwardTo,
      outputRangeBackFrom,
      outputRangeBackTo,
    ),
  });
};

export const useAllDirectionTransition = (styleKey: string, value: number) => {
  return useNavigationTransition(
    styleKey,
    [0, 1],
    [0, -value], // Forward from
    [value, 0], // Forward to
    [0, value], // Back from
    [-value, 0], // Back to
  );
};

export const useDirectionTransition = (styleKey: string, value: number) => {
  return useNavigationTransition(
    styleKey,
    [0, 1],
    [0, value], // Forward from
    [value, 0], // Forward to
    [0, value], // Back from
    [value, 0], // Back to
  );
};
