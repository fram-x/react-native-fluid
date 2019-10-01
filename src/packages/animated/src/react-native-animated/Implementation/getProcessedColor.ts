import { IAnimationNode } from "../../Types";
import { isAnimatedNode } from "./utils";
import { Animated } from "react-native";

// @TODO: Could we resolve this in another way?
const normalizeColor = require("react-native/Libraries/Color/normalizeColor");

export const getProcessedColor = (
  value: string | number | IAnimationNode,
): number => {
  if (isAnimatedNode(value)) {
    // @ts-ignore
    return normalizeColor((value as Animated.Value).__getValue());
  }
  return normalizeColor(value);
};
