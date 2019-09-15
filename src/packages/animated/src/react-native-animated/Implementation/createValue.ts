import { Animated } from "react-native";
import { isAnimatedNode } from "./utils";
import { IAnimationNode } from "../../Types";

export const createValue = (v: number | IAnimationNode) => {
  if (isAnimatedNode(v)) {
    // @ts-ignore
    return new Animated.Value(v.__getValue());
  }
  return new Animated.Value(v as number);
};
