import { NavigationState } from "../types";
import {
  useRef,
  useState,
  useContext,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { useNavigation, useNavigationEvents } from "react-navigation-hooks";
import {
  NavigationScreenProp,
  NavigationRoute,
  NavigationParams,
} from "react-navigation";
import { StackCardAnimationContext } from "react-navigation-stack";

// @ts-ignore
import { always } from "react-native-reanimated/src/base";
import Animated from "react-native-reanimated";

export const useNavigationState = (
  _name: string,
): { navigationState: NavigationState; index: number } => {
  const [navigationState, setNavigationState] = useState<NavigationState>(
    NavigationState.None,
  );

  const navigation = useNavigation();
  const myIndexRef = useRef(getMyIndex(navigation));
  const prevIndexRef = useRef(getIndex(navigation));

  // Set up node for tracking swiping
  const stackCardAnimationContext = useContext(StackCardAnimationContext);

  const updateSwiping = useCallback((args: readonly (0 | 1)[]) => {
    const isSwiping = args[0];
    if (isSwiping) {
      setNavigationState(NavigationState.BackFrom);
    }
  }, []);

  const updateSwipingNode = useMemo(() => {
    if (stackCardAnimationContext) {
      return always(
        Animated.onChange(stackCardAnimationContext.swiping, [
          Animated.call([stackCardAnimationContext.swiping], updateSwiping),
        ]),
      );
    } else return Animated.block([]);
  }, [stackCardAnimationContext, updateSwiping]);

  useEffect(() => {
    updateSwipingNode.__attach();
    return () => updateSwipingNode.__detach();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useNavigationEvents(p => {
    // console.log(name, p.action.type);
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
        if (
          forward &&
          !focused &&
          nextNavigationState === NavigationState.None
        ) {
          // DO nothing - we'd like to keep the state
        } else {
          setNavigationState(nextNavigationState);
        }
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
