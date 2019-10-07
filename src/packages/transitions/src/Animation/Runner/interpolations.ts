import {
  IAnimationNode,
  AnimationProvider,
  IAnimationValue,
} from "react-native-fluid-animations";
import { fluidInternalException } from "../../Types";

export const RunningFlags = {
  NotStarted: -1,
  Started: 1,
  Stopped: 2,
};

/**
 * @description Registers a running animation for a transition item and a given key
 * @param itemId TransitionItem id
 * @param key Key that is animated
 * @param animationId Id of the interpolation
 * @param source Driver for the animation
 * @param animation Animation node
 */
export const registerRunningInterpolation = (
  itemId: number,
  key: string,
  animationId: number,
  source: IAnimationValue,
  animation: IAnimationNode,
  isRunningFlag: IAnimationValue,
  isRunningValue: number,
) => {
  const runningKey = getKey(itemId, key);

  // Attach nodes
  AnimationProvider.Animated.attach(source, animation);

  // Register that we have attached
  if (!_runningInterpolations[runningKey]) {
    _runningInterpolations[runningKey] = {};
  }

  _runningInterpolations[runningKey][animationId] = {
    source,
    animation,
    animationId,
    isRunningFlag: isRunningFlag,
    isRunningShadow: isRunningValue,
  };

  //console.log("Added interpolation for", itemId, "key:", key);
};

/**
 * @description Sends a stop signal to a running animation
 * @param itemId
 * @param key
 * @param animationId
 */
export const stopRunningInterpolation = (
  itemId: number,
  key: string,
  animationId: number,
) => {
  const runningKey = getKey(itemId, key);
  if (!ensureInterpolation(itemId, key, animationId)) return;
  if (
    _runningInterpolations[runningKey][animationId].isRunningShadow ===
    RunningFlags.Stopped
  )
    return;

  // console.log(
  //   "Stopping interpolation",
  //   animationId,
  //   "for",
  //   key,
  //   "item",
  //   itemId,
  // );
  _runningInterpolations[runningKey][animationId].isRunningShadow =
    RunningFlags.Stopped;
  _runningInterpolations[runningKey][animationId].isRunningFlag.setValue(
    RunningFlags.Stopped,
  );
};

/**
 * @description Sends a start signal to a running animation
 * @param itemId
 * @param key
 * @param animationId
 */
export const startRunningInterpolation = (
  itemId: number,
  key: string,
  animationId: number,
) => {
  const runningKey = getKey(itemId, key);
  if (!ensureInterpolation(itemId, key, animationId)) return;

  // console.log(
  //   "Starting interpolation",
  //   animationId,
  //   "for",
  //   key,
  //   "item",
  //   itemId,
  // );
  _runningInterpolations[runningKey][animationId].isRunningShadow =
    RunningFlags.Started;
  _runningInterpolations[runningKey][animationId].isRunningFlag.setValue(
    RunningFlags.Started,
  );
};

/**
 * @description Unregisters a running animation for a transition item and a given key
 * @param itemId TransitionItem id
 * @param key Key that is animated
 * @param animationId Id of the interpolation
 */
export const unregisterRunningInterpolation = (
  itemId: number,
  key: string,
  animationId: number,
) => {
  const runningKey = getKey(itemId, key);
  if (!ensureInterpolation(itemId, key, animationId)) return;

  // Now we are ready.
  stopRunningInterpolation(itemId, key, animationId);

  // console.log("Removing interpolation for", itemId, "key:", key);

  // Detach node
  AnimationProvider.Animated.detach(
    _runningInterpolations[runningKey][animationId].source,
    _runningInterpolations[runningKey][animationId].animation,
  );

  // Unregister attachment
  delete _runningInterpolations[runningKey][animationId];
  if (Object.keys(_runningInterpolations[runningKey]).length === 0) {
    delete _runningInterpolations[runningKey];
  }
};

/**
 * @description Unregisters a running animation for a transition item and a given key
 * @param itemId TransitionItem id
 * @param key Key that is animated
 * @param animationId Id of the interpolation
 */
export const isInterpolationRunning = (
  itemId: number,
  key: string,
  animationId: number,
) => {
  const runningKey = getKey(itemId, key);
  return (
    _runningInterpolations[runningKey] &&
    _runningInterpolations[runningKey][animationId] &&
    _runningInterpolations[runningKey][animationId].isRunningShadow
  );
};

const ensureInterpolation = (
  itemId: number,
  key: string,
  animationId: number,
) => {
  const runningKey = getKey(itemId, key);
  if (!_runningInterpolations[runningKey]) {
    return false;
  }
  if (!_runningInterpolations[runningKey][animationId]) {
    return false;
  }
};
const getKey = (itemId: number, key: string) => {
  return `${itemId}-${key}`;
};

type RunningInterpolation = {
  source: IAnimationValue;
  animation: IAnimationNode;
  animationId: number;
  isRunningFlag: IAnimationValue;
  isRunningShadow: number;
};

const _runningInterpolations: {
  [key: string]: { [key: number]: RunningInterpolation };
} = {};
