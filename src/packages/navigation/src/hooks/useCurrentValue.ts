import Animated from "react-native-reanimated";
import { useRef, useEffect, useMemo, useContext } from "react";
import { StackAnimationProgressContext } from "react-navigation-stack";
// @ts-ignore
import { always } from "react-native-reanimated/src/base";
import { NavigationState } from "../types";
import { AnimationProvider } from "react-native-fluid-animations";

export const useCurrentValue = (
  name: string,
  navigationState: NavigationState,
): {
  duration: Animated.Value<number>;
  current: Animated.Node<number>;
} => {
  // Save navigation state
  const prevNavigationStateRef = useRef(navigationState);

  // Get progress from stack navigation context
  const progressValue = useContext(StackAnimationProgressContext);

  // Set up some values to track
  const currentValue = useMemo(() => new Animated.Value(0), []);
  const durationValue = useMemo(() => new Animated.Value<number>(0), []);

  // States
  const isForward =
    navigationState === NavigationState.ForwardFrom ||
    navigationState === NavigationState.ForwardTo;

  const inTransition = navigationState !== NavigationState.None;

  const isFocused =
    navigationState === NavigationState.ForwardTo ||
    navigationState === NavigationState.BackTo;

  // console.log(
  //   name,
  //   "in transition:",
  //   inTransition,
  //   "focused:",
  //   isFocused,
  //   "forward:",
  //   isForward,
  // );

  // Remember some values
  const updateValueRef = useRef<Animated.Node<any>>();

  // Cleanup nodes
  useEffect(
    () => () => {
      // @ts-ignore
      updateValueRef.current && updateValueRef.current.__detach();
      updateValueRef.current = undefined;
    },
    [],
  );

  if (prevNavigationStateRef.current !== navigationState) {
    // Save cached value
    prevNavigationStateRef.current = navigationState;

    // Detach old
    if (updateValueRef.current) {
      // @ts-ignore
      updateValueRef.current.__detach();
    }

    // Set up new
    updateValueRef.current = always(
      Animated.block([
        updateCurrentProc(
          currentValue,
          splitProgressProc(
            normalizeProgressProc(
              progressValue,
              new Animated.Value(isForward ? 1 : 0),
            ),
            new Animated.Value(isFocused ? 1 : 0),
          ),
          new Animated.Value(inTransition ? 1 : 0),
          durationValue,
        ),
      ]),
    );

    // @ts-ignore
    updateValueRef.current.__attach();
  }

  return {
    current: currentValue,
    duration: durationValue,
  };
};

const normalizeProgressProc = Animated.proc((progress, isForward) =>
  Animated.cond(
    Animated.neq(isForward, 1),
    Animated.sub(1, progress),
    progress,
  ),
);

const splitProgressProc = Animated.proc((normalizedProgress, isFocused) =>
  Animated.cond(
    Animated.eq(isFocused, 1),
    // Focused screen
    Animated.cond(
      Animated.greaterThan(normalizedProgress, 0.5),
      Animated.multiply(2, Animated.sub(normalizedProgress, 0.5)),
      0,
    ),
    // Screen we are moving from
    Animated.cond(
      Animated.lessThan(normalizedProgress, 0.5),
      Animated.multiply(normalizedProgress, 2),
      1,
    ),
  ),
);

const updateCurrentProc = Animated.proc(
  (current, splitProgress, inTransition, duration) =>
    Animated.block([
      Animated.cond(
        Animated.eq(inTransition, 1),
        Animated.set(
          current,
          Animated.divide(splitProgress, Animated.divide(1.0, duration)),
        ),
      ),
    ]),
);
