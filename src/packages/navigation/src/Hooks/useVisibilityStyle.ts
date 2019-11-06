import { useRef, useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

export const useVisibilityStyle = (
  index: number,
  _normalizedProgress: Animated.Node<number>,
) => {
  // Set opacity to 0 for all screens except the first one
  const styleRef = useRef<StyleProp<ViewStyle>>({
    opacity: index > 0 ? 0 : 1,
  });

  useEffect(() => {
    styleRef.current = {};
  }, []);

  return styleRef.current;
};
