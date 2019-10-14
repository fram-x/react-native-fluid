import { InterpolationInfo, TransitionItem } from "../../Components/Types";
import {
  AnimationProvider,
  IAnimationNode,
  IAnimationValue,
} from "react-native-fluid-animations";
import { createInterpolationNode } from "./Functions";

export const addInterpolation = (
  interpolator: IAnimationNode,
  interpolationInfo: InterpolationInfo,
) => {
  const { key, interpolate, interpolationConfig } = interpolationInfo;

  const {
    inputRange,
    outputRange,
    extrapolate,
    extrapolateLeft,
    extrapolateRight,
  } = interpolationConfig;

  const interpolationNode = createInterpolationNode(
    interpolator,
    interpolationInfo.interpolator,
    interpolationInfo.id,
    key,
    interpolationInfo.itemId,
    inputRange || [0, 1],
    outputRange,
    extrapolate,
    extrapolateLeft,
    extrapolateRight,
    interpolate,
  );

  // Add to list of interpolations
  _runningInterpolations[
    getInterpolationKey(interpolationInfo.itemId, interpolationInfo.key)
  ] = {
    interpolator: interpolator as IAnimationValue,
    interpolationNode,
  };

  // @ts-ignore
  AnimationProvider.Animated.attach(interpolator, interpolationNode);
};

export const removeInterpolation = (
  itemId: number,
  interpolationKey: string,
) => {
  const key = getInterpolationKey(itemId, interpolationKey);
  const attachedNode = _runningInterpolations[key];
  delete _runningInterpolations[key];
  AnimationProvider.Animated.detach(
    attachedNode.interpolator,
    attachedNode.interpolationNode,
  );
};

const getInterpolationKey = (itemId: number, key: string) => {
  return `${itemId}-${key}`;
};

type AttachedNode = {
  interpolator: IAnimationValue;
  interpolationNode: IAnimationNode;
};
const _runningInterpolations: { [key: string]: AttachedNode } = {};
