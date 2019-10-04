import {
  IAnimationNode,
  AnimationProvider,
  IAnimationValue,
} from "react-native-fluid-animations";

/**
 * @description Registers a running animation for a transition item and a given key
 * @param itemId TransitionItem id
 * @param key Key that is animated
 * @param source Driver for the animation
 * @param animation Animation node
 */
export const registerRunningInterpolation = (
  itemId: number,
  key: string,
  animationId: number,
  source: IAnimationValue,
  animation: IAnimationNode,
) => {
  // Unregister previous
  unregisterRunningInterpolation(itemId, key);
  // Attach nodes
  AnimationProvider.Animated.attach(source, animation);
  // Register attachment
  _runningInterpolations[getKey(itemId, key)] = {
    source,
    animation,
    animationId,
  };
  console.log("Added interpolation for", itemId, "key:", key);
};

/**
 * @description Unregisters a running animation for a transition item and a given key
 * @param itemId TransitionItem id
 * @param key Key that is animated
 */
export const unregisterRunningInterpolation = (
  itemId: number,
  key: string,
  animationId?: number,
) => {
  const runningKey = getKey(itemId, key);

  // Get previous running interpolation for this item/key
  const tmp = _runningInterpolations[runningKey];
  if (!tmp) return;

  if (animationId && tmp.animationId > animationId) return;

  // Now we are ready.
  console.log("Removing interpolation for", itemId, "key:", key);
  // Unregister attachment
  delete _runningInterpolations[runningKey];
  // Detach node
  AnimationProvider.Animated.detach(tmp.source, tmp.animation);
};

const getKey = (itemId: number, key: string) => {
  return `${itemId}-${key}`;
};

type RunningInterpolation = {
  source: IAnimationValue;
  animation: IAnimationNode;
  animationId: number;
};

const _runningInterpolations: {
  [key: string]: RunningInterpolation;
} = {};
