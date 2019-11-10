import { Animated, Easing } from "react-native";
import { IAnimationValue } from "../../Types";

export const runTiming = (master: IAnimationValue, duration: number): void => {
  Animated.timing(master as Animated.Value, {
    toValue: duration,
    duration,
    easing: Easing.linear,
    isInteraction: false,
  }).start(() => {
    (master as Animated.Value).removeAllListeners();
  });
};
