import { createAnimationNode } from "./Functions";
import { AnimationInfo } from "../../Components/Types/AnimationInfo";
import { Easings } from "../../Components/Types";
import { IAnimationNode, IAnimationValue } from "react-native-fluid-animations";
import {
  unregisterRunningInterpolation,
  registerRunningInterpolation,
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
    // Create node
    const animationNode = createAnimationNode(
      source,
      target,
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
      onBegin,
      () => {
        unregisterRunningInterpolation(ownerId, key);
        onEnd && onEnd();
      },
      interpolate,
    );

    registerRunningInterpolation(
      ownerId,
      key,
      source as IAnimationValue,
      animationNode,
    );
  });
};
