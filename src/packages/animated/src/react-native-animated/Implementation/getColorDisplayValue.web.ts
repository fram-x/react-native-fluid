import { IAnimationNode } from "../../Types/IAnimationNode";
import { ColorNode } from "./ColorNode";
import { Animated } from "react-native";

export const getColorDisplayValue = (input: IAnimationNode) => {
  return new ColorNode(input as Animated.Value);
};
