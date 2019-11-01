import { createAnimationNode } from "./Functions";
import { AnimationInfo } from "../../Components/Types/AnimationInfo";
import { Easings, DriverContextType } from "../../Components/Types";
import { IAnimationNode } from "react-native-fluid-animations";

export const addAnimations = (
  source: IAnimationNode,
  driverContext: DriverContextType | undefined,
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
    createAnimationNode(
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
      onEnd,
      interpolate,
      driverContext ? driverContext.isActive : () => false,
    );
  });
};
