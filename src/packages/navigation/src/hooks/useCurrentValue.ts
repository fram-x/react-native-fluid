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

    const debug = (m: string, v: Animated.Node<number>) => {
      //return AnimationProvider.Animated.debug(m, v) as Animated.Node<number>;
      return v;
    };

    // Normalize so that the progress always moves from 0..1
    normalizedProgress.current = Animated.cond(
      Animated.neq(isForwardValue, 1),
      Animated.sub(1, transitionContext.progress),
      transitionContext.progress,
    );

    // Now split the navigation into two parts, one for the starting screen
    // and one for the end screen
    const splitProgress = Animated.cond(
      Animated.eq(isFocusedValue, 1),
      // Focused screen
      Animated.cond(
        Animated.greaterThan(normalizedProgress.current, 0.5),
        Animated.multiply(2, Animated.sub(normalizedProgress.current, 0.5)),
        0,
      ),
      // Screen we are moving from
      Animated.cond(
        Animated.lessThan(normalizedProgress.current, 0.5),
        Animated.multiply(normalizedProgress.current, 2),
        1,
      ),
    );

    // Set up new
    updateValueRef.current = always(
      Animated.cond(
        Animated.eq(inTransitionValue, 1),
        debug(
          screenName,
          Animated.set(
            currentValue,
            Animated.divide(splitProgress, Animated.divide(1.0, durationValue)),
          ),
        ),
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
