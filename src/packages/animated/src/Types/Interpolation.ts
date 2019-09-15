import { IAnimationNode } from "./IAnimationNode";

export type ExtrapolateType = "extend" | "identity" | "clamp";

export type InterpolationConfig = {
  inputRange?: number[];
  outputRange: Array<IAnimationNode | number | string>;
  extrapolate?: ExtrapolateType;
  extrapolateLeft?: ExtrapolateType;
  extrapolateRight?: ExtrapolateType;
};
