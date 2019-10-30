import { safeGetState } from "../Functions";
import { NavigationState } from "../types";
import { useContext } from "react";
import { StateContext } from "react-native-fluid-transitions";

export const useNavigationStates = () => {
  const stateContext = useContext(StateContext);
  if (!stateContext) throw Error("State context is missing.");

  const forwardFrom = safeGetState(
    NavigationState.ForwardFrom,
    stateContext.states,
  );
  const forwardTo = safeGetState(
    NavigationState.ForwardTo,
    stateContext.states,
  );
  const backFrom = safeGetState(NavigationState.BackFrom, stateContext.states);
  const backTo = safeGetState(NavigationState.BackTo, stateContext.states);
  return { forwardFrom, forwardTo, backFrom, backTo };
};
