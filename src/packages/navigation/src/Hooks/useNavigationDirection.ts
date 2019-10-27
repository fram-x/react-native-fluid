import { useContext } from "react";
import { StateContext } from "react-native-fluid-transitions";
import { safeGetState } from "../Functions";
import { NavigationState } from "../types";
import { ChildAnimationDirection } from "react-native-fluid-transitions";

export const useNavigationDirection = (): ChildAnimationDirection => {
  const stateContext = useContext(StateContext);
  if (!stateContext) {
    throw Error("State context is missing");
  }

  const forwardState = safeGetState(
    NavigationState.Forward,
    stateContext.states,
  );

  return forwardState.active ? "forward" : "backward";
};
