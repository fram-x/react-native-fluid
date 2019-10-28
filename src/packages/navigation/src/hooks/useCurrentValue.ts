import Animated from "react-native-reanimated";
import { useRef, useEffect, useMemo } from "react";
import { AnimationProvider } from "react-native-fluid-animations";
import { useAsAnimatedValue } from "./useAsAnimatedValue";
// @ts-ignore
import { always } from "react-native-reanimated/src/base";
import { TransitionContextType } from "@react-navigation/stack/src/utils/TransitionContext";

export const useCurrentValue = (
  screenName: string,
  transitionContext: TransitionContextType,
): {
  duration: Animated.Value<number>;
  current: Animated.Node<number>;
  normalizedProgress: Animated.Node<number>;
} => {
  const currentValue = useMemo(() => new Animated.Value(0), []);
  const normalizedProgress = useRef<Animated.Node<number>>();
  const durationValue = useMemo(() => new Animated.Value<number>(0), []);

  const isForwardValue = useAsAnimatedValue(transitionContext.isForward);
  const inTransitionValue = useAsAnimatedValue(transitionContext.inTransition);
  const isFocusedValue = useAsAnimatedValue(transitionContext.focused);

  const progressRef = useRef<Animated.Node<any>>();
  const updateValueRef = useRef<Animated.Node<any>>();

  useEffect(
    () => () => {
      // @ts-ignore
      updateValueRef.current && updateValueRef.current.__detach();
      updateValueRef.current = undefined;
    },
    [],
  );

  if (
    transitionContext.progress !== progressRef.current &&
    transitionContext.inTransition
  ) {
    // Save cached value
    progressRef.current = transitionContext.progress;

    // Detach old
    if (updateValueRef.current) {
      // @ts-ignore
      updateValueRef.current.__detach();
    }

    // Set up new
    updateValueRef.current = always(
      updateCurrentProc(
        currentValue,
        splitProgressProc(
          normalizeProgressProc(transitionContext.progress, isForwardValue),
          isFocusedValue,
        ),
        inTransitionValue,
        durationValue,
      ),
    );

    // @ts-ignore
    updateValueRef.current.__attach();
  }

  return {
    current: currentValue,
    duration: durationValue,
    normalizedProgress: normalizedProgress.current as Animated.Node<number>,
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
    Animated.cond(
      Animated.eq(inTransition, 1),
      Animated.set(
        current,
        Animated.divide(splitProgress, Animated.divide(1.0, duration)),
      ),
    ),
);
