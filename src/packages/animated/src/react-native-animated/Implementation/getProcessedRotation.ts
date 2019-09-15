import { IAnimationNode } from "../../Types";
import { isAnimatedNode } from "./utils";
import { Animated } from "react-native";

export const getProcessedRotation = (
  value: string | IAnimationNode
): number | IAnimationNode => {
  let resolvedValue: string;
  if (isAnimatedNode(value)) {
    // @ts-ignore
    resolvedValue = (value as Animated.Node).__getValue();
  } else {
    resolvedValue = value as string;
  }

  if (/deg$/.test(resolvedValue)) {
    const degrees = parseFloat(resolvedValue) || 0;
    const radians = (degrees * Math.PI) / 180.0;
    return radians;
  } else {
    // Assume radians
    return resolvedValue;
  }
};
