import { InterpolationInfo } from "../../Components/Types";
import { IAnimationNode, IAnimationValue } from "react-native-fluid-animations";
import { createInterpolationNode } from "./Functions";
import {
  registerRunningInterpolation,
  unregisterRunningInterpolation,
} from "./interpolations";

export const addInterpolation = (
  source: IAnimationNode,
  interpolationInfo: InterpolationInfo,
) => {
  const { key, interpolate, itemId, interpolationConfig } = interpolationInfo;

  const {
    inputRange,
    outputRange,
    extrapolate,
    extrapolateLeft,
    extrapolateRight,
  } = interpolationConfig;

  const interpolationNode = createInterpolationNode(
    source,
    interpolationInfo.interpolator,
    key,
    inputRange || [0, 1],
    outputRange,
    extrapolate,
    extrapolateLeft,
    extrapolateRight,
    interpolate,
  );

  registerRunningInterpolation(
    itemId,
    key,
    source as IAnimationValue,
    interpolationNode,
  );
};
