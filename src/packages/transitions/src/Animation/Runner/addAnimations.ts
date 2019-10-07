import { createAnimationNode } from "./Functions";
import { AnimationInfo } from "../../Components/Types/AnimationInfo";
import { Easings } from "../../Components/Types";
import {
  IAnimationNode,
  IAnimationValue,
  AnimationProvider,
} from "react-native-fluid-animations";
import {
  unregisterRunningInterpolation,
  registerRunningInterpolation,
  startRunningInterpolation,
  RunningFlags,
  stopRunningInterpolation,
} from "./interpolations";

export const addAnimations = (
  source: IAnimationNode,
  animations: AnimationInfo[],
) => {
  // Skip tracking?
  if (animations.length === 0) return;

  // Populate with all interpolations from the tracker list
  animations.forEach(animation => {
    const {
      animationId,
      key,
      ownerId,
      inputRange,
      easing,
      easingKey,
      extrapolate,
      extrapolateLeft,
      extrapolateRight,
      outputRange,
      duration,
      target,
      offset,
      onBegin,
      onEnd,
      interpolate,
    } = animation;

    // Get easing
    const easingFunction = easing || Easings.linear;

    // Create running flag - initial value should be -1 to signal that
    // we have not started
    const isRunningFlag = AnimationProvider.createValue(
      RunningFlags.NotStarted,
    );

    let onBeginOnce: (() => void) | undefined;
    onBeginOnce = () => {
      onBeginOnce = undefined;
      startRunningInterpolation(ownerId, key, animationId);
      onBegin && onBegin();
    };

    let onEndOnce: (() => void) | undefined;
    onEndOnce = () => {
      onEndOnce = undefined;
      stopRunningInterpolation(ownerId, key, animationId);
      unregisterRunningInterpolation(ownerId, key, animationId);
      onEnd && onEnd();
    };

    // Create node
    const animationNode = createAnimationNode(
      source,
      target,
      isRunningFlag,
      animationId,
      key,
      ownerId,
      offset,
      duration,
      easingFunction,
      easingKey || "linear",
      inputRange,
      outputRange,
      extrapolate,
      extrapolateLeft,
      extrapolateRight,
      onBeginOnce,
      onEndOnce,
      interpolate,
    );

    registerRunningInterpolation(
      ownerId,
      key,
      animationId,
      source as IAnimationValue,
      animationNode,
      isRunningFlag,
      RunningFlags.NotStarted,
    );
  });
};
