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
  current: Animated.Value<number>;
} => {
  const currentValue = useMemo(() => new Animated.Value(0), []);
  const durationValue = useMemo(() => new Animated.Value<number>(0), []);

  const isForwardValue = useAsAnimatedValue(transitionContext.isForward);
  const inTransitionValue = useAsAnimatedValue(transitionContext.inTransition);

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
    console.log(
      screenName,
      "UPDATE PROGRESS",
      // @ts-ignore
      transitionContext.progress.__nodeID,
    );

    // Save cached value
    progressRef.current = transitionContext.progress;

    // Detach old
    if (updateValueRef.current) {
      // @ts-ignore
      updateValueRef.current.__detach();
    }

    const debug = (m: string, v: Animated.Node<number>) => {
      return AnimationProvider.Animated.debug(m, v) as Animated.Node<number>;
      // return v;
    };

    // Set up new
    updateValueRef.current = always(
      Animated.cond(Animated.eq(inTransitionValue, 1), [
        Animated.cond(
          Animated.neq(isForwardValue, 1),
          [
            // We are running backwards
            debug(
              "<- " +
                screenName +
                " backwards " +
                // @ts-ignore
                transitionContext.progress.__nodeID,
              Animated.set(
                currentValue,
                Animated.divide(
                  Animated.sub(1, transitionContext.progress),
                  Animated.divide(1.0, durationValue),
                ),
              ),
            ),
          ],
          [
            // We are running forwards
            debug(
              "-> " +
                screenName +
                " forward " +
                // @ts-ignore
                transitionContext.progress.__nodeID,
              Animated.set(
                currentValue,
                Animated.divide(
                  transitionContext.progress,
                  Animated.divide(1.0, durationValue),
                ),
              ),
            ),
          ],
        ),
      ]),
    );

    // @ts-ignore
    updateValueRef.current.__attach();
  }

  return { current: currentValue, duration: durationValue };
};
