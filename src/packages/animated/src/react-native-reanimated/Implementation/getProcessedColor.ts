import { processColor } from "react-native";
import { IAnimationNode } from "../../Types";
import { isAnimatedNode } from "./utils";

export const getProcessedColor = (
  value: IAnimationNode | string | number
): IAnimationNode | number => {
  const isAnimatedValue = isAnimatedNode(value);
  if (isAnimatedValue) return value;
  return processColor(value);
};
