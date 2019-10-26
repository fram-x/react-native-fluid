import { NavigationState } from "../types";
import { TransitionContextType } from "@react-navigation/stack/src/utils/TransitionContext";
import { useRef } from "react";

export const useNavigationState = (
  transitionContext: TransitionContextType,
): NavigationState => {
  const navigationStateRef = useRef<NavigationState>(NavigationState.None);
  const nextNavigationState = !transitionContext.inTransition
    ? NavigationState.None
    : transitionContext.isForward
    ? transitionContext.focused
      ? NavigationState.ForwardTo
      : NavigationState.ForwardFrom
    : transitionContext.focused
    ? NavigationState.BackTo
    : NavigationState.BackFrom;

  if (navigationStateRef.current !== nextNavigationState) {
    if (nextNavigationState !== NavigationState.None) {
      navigationStateRef.current = nextNavigationState;
    }
  }
  return navigationStateRef.current;
};
