import { IAnimationNode } from "../../Types";
import { isAnimatedNode } from "./utils";

export const getProcessedRotation = (
  value: IAnimationNode | string
): IAnimationNode | number => {
  if (isAnimatedNode(value)) return value;
  if (/deg$/.test(value as string)) {
    const degrees = parseFloat(value as string) || 0;
    const radians = (degrees * Math.PI) / 180.0;
    return radians;
  } else {
    // Assume radians
    return parseFloat(value as string);
  }
};
