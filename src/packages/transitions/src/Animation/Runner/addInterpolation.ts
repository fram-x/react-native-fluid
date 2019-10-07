import { InterpolationInfo } from "../../Components/Types";
import {
  IAnimationNode,
  IAnimationValue,
  AnimationProvider,
} from "react-native-fluid-animations";
import { createInterpolationNode } from "./Functions";
import { registerRunningInterpolation, RunningFlags } from "./interpolations";

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

  // Create running flag - initial value should be -1 to signal that
  // we have not started
  const isRunningFlag = AnimationProvider.createValue(RunningFlags.NotStarted);

  // Create the interpolation node
  const interpolationNode = createInterpolationNode(
    source,
    interpolationInfo.interpolator,
    isRunningFlag,
    key,
    inputRange || [0, 1],
    outputRange,
    extrapolate,
    extrapolateLeft,
    extrapolateRight,
    interpolate,
  );

  // Register the running interpolation
  registerRunningInterpolation(
    itemId,
    key,
    interpolationInfo.id,
    source as IAnimationValue,
    interpolationNode,
    isRunningFlag,
    RunningFlags.NotStarted,
  );
};
