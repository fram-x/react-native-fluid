import { NavigationState } from "../types";
import { useRef, useState } from "react";
import { useNavigation, useNavigationEvents } from "react-navigation-hooks";
import {
  NavigationScreenProp,
  NavigationRoute,
  NavigationParams,
} from "react-navigation";

export const useNavigationState = (
  name: string,
): { navigationState: NavigationState; index: number } => {
  const [navigationState, setNavigationState] = useState<NavigationState>(
    NavigationState.None,
  );

  const navigation = useNavigation();
  const myIndexRef = useRef(getMyIndex(navigation));
  const prevIndexRef = useRef(getIndex(navigation));

  useNavigationEvents(p => {
    if (
      p.action.type === "Navigation/NAVIGATE" ||
      p.action.type === "Navigation/COMPLETE_TRANSITION"
    ) {
      const parent = navigation.dangerouslyGetParent();
      if (!parent) return;
      const { index, routes } = parent.state;

      const inTransition =
        p.action.type === "Navigation/NAVIGATE" ? true : false;

      const focused = navigation.isFocused();
      const forward = prevIndexRef.current <= index;

      prevIndexRef.current = index;

      const nextNavigationState =
        !inTransition ||
        (forward && routes.length === 1 && navigation.isFirstRouteInParent())
          ? NavigationState.None
          : forward
          ? focused
            ? NavigationState.ForwardTo
            : NavigationState.ForwardFrom
          : focused
          ? NavigationState.BackTo
          : NavigationState.BackFrom;

      if (nextNavigationState !== navigationState) {
        setNavigationState(nextNavigationState);
      }
    }
  });

  return { navigationState, index: myIndexRef.current };
};

function getIndex(
  navigation: NavigationScreenProp<
    NavigationRoute<NavigationParams>,
    NavigationParams
  >,
) {
  const parent = navigation.dangerouslyGetParent();
  if (!parent) return -1;

  const { index } = parent.state;
  return index;
}

function getMyIndex(
  navigation: NavigationScreenProp<
    NavigationRoute<NavigationParams>,
    NavigationParams
  >,
) {
  const parent = navigation.dangerouslyGetParent();
  if (!parent) return -1;

  const { routes } = parent.state;
  const { key } = navigation.state;
  return routes.findIndex(r => r.key === key);
}
