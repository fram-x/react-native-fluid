import { NavigationState } from "../types";
import { StateContextType } from "react-native-fluid-transitions";
import { TransitionContextType } from "@react-navigation/stack/src/utils/TransitionContext";

export const getNavigationStates = (
  navigationState: NavigationState,
  transitionContext: TransitionContextType,
  stateContext: StateContextType | null,
) => {
  const states = [
    ...(stateContext ? stateContext.states : []),
    {
      name: NavigationState.None,
      active: navigationState === NavigationState.None,
    },
    {
      name: NavigationState.ForwardTo,
      active: navigationState === NavigationState.ForwardTo,
    },
    {
      name: NavigationState.ForwardFrom,
      active: navigationState === NavigationState.ForwardFrom,
    },
    {
      name: NavigationState.BackTo,
      active: navigationState === NavigationState.BackTo,
    },
    {
      name: NavigationState.BackFrom,
      active: navigationState === NavigationState.BackFrom,
    },
    {
      name: NavigationState.InTransition,
      active: transitionContext.inTransition,
    },
    {
      name: NavigationState.Focused,
      active: transitionContext.focused,
    },
    {
      name: NavigationState.Forward,
      active: transitionContext.isForward,
    },
    {
      name: NavigationState.Index,
      active: true,
      value: transitionContext.index,
    },
  ];
  return states;
};
