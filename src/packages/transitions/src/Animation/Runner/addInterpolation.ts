import { InterpolationInfo } from "../../Components/Types";
import { IAnimationNode } from "react-native-fluid-animations";
import { createInterpolationNode } from "./Functions";

export const addInterpolation = (
  interpolator: IAnimationNode,
  interpolationInfo: InterpolationInfo
) => {
  const { key, interpolate, interpolationConfig } = interpolationInfo;

  const {
    inputRange,
    outputRange,
    extrapolate,
    extrapolateLeft,
    extrapolateRight
  } = interpolationConfig;

  createInterpolationNode(
    interpolator,
    interpolationInfo.interpolator,
    key,
    inputRange || [0, 1],
    outputRange,
    extrapolate,
    extrapolateLeft,
    extrapolateRight,
    interpolate
  );
};
