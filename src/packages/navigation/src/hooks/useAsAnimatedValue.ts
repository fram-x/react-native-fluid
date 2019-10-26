import Animated from "react-native-reanimated";
import { useRef, useMemo } from "react";

export const useAsAnimatedValue = (value: boolean): Animated.Value<number> => {
  const animatedValue = useMemo(
    () => new Animated.Value(value ? 1 : 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  animatedValue.setValue(value ? 1 : 0);
  return animatedValue;
};
