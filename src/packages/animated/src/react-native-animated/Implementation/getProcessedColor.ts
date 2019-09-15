import { IAnimationNode } from "../../Types";
import { isAnimatedNode } from "./utils";
import { Animated } from "react-native";

const normalizeColor = require("normalizeColor");

export const getProcessedColor = (
  value: string | number | IAnimationNode
): number => {
  if (isAnimatedNode(value)) {
    // @ts-ignore
    return normalizeColor((value as Animated.Value).__getValue());
  }
  return normalizeColor(value);
};
