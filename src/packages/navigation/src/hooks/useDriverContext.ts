import Animated from "react-native-reanimated";
import { useMemo } from "react";
import { DriverContextType } from "react-native-fluid-transitions";
import { NavigationState } from "../types";

export const useDriverContext = (
  screenName: string,
  navigationState: NavigationState,
  durationValue: Animated.Value<number>,
  current: Animated.Node<number>,
): DriverContextType => {
  return useMemo<DriverContextType>(
    () => ({
      isActive: () => navigationState !== NavigationState.None,
      driver: current,
      requestDuration: (duration: number) => {
        durationValue.setValue(duration);
        console.log("---", screenName, "got duration", duration);
      },
    }),
    [current, durationValue, navigationState, screenName],
  );
};
