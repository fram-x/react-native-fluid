import { useContext } from "react";
import { StateContext, useFluidConfig } from "react-native-fluid-transitions";
import { createWhenConfiguration } from "./createNavigationTransition";
// @ts-ignore
import { ConfigWhenType } from "react-native-fluid-transitions";
import { ConfigType } from "react-native-fluid-transitions";

export const useNavigationTransition = (
  styleKey: string,
  inputRange: Array<number | string>,
  outputRangeForwardFrom: Array<number | string>,
  outputRangeForwardTo: Array<number | string>,
  outputRangeBackFrom: Array<number | string>,
  outputRangeBackTo: Array<number | string>,
): ConfigType => {
  const stateContext = useContext(StateContext);
  if (!stateContext) {
    throw Error("State context is missing");
  }

  return useFluidConfig(
    createWhenConfiguration(
      stateContext.states,
      styleKey,
      inputRange,
      outputRangeForwardFrom,
      outputRangeForwardTo,
      outputRangeBackFrom,
      outputRangeBackTo,
    ),
  );
};
