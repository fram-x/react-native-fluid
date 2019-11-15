import {
  IAnimationNode,
  AnimationProvider,
  IAnimationValue,
} from "react-native-fluid-animations";

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

  // console.log(
  //   "Registered interpolation",
  //   animationId,
  //   "for",
  //   itemId,
  //   "key:",
  //   key,
  // );
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
  if (!ensureInterpolation(itemId, key, animationId)) {
    // console.log(
    //   "**** Could not find interpolation",
    //   animationId,
    //   "for",
    //   itemId,
    //   "key:",
    //   key,
    // );
    // Just return when there is no animation to remove.
    // These methods aren't necessarily symetric - since we
    // have multiple ways of trying to clean up.
    return;
  }

  // console.log(
  //   "Removing interpolation",
  //   animationId,
  //   "for",
  //   itemId,
  //   "key:",
  //   key,
  // );

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
 * @description Returns a statement node that stops prevvious animations when
 * this one starts.
 * @param itemId
 * @param key
 * @param animationId
 */
export const getStopPreviousAnimationNode = (
  itemId: number,
  key: string,
  animationId: number,
) => {
  const runningKey = getKey(itemId, key);
  if (!_runningInterpolations[runningKey]) {
    return 0;
  }
  const interpolationKeys = Object.keys(_runningInterpolations[runningKey]);
  const prevInterpolations = interpolationKeys
    .filter(k => (k as any) !== animationId)
    .map(k => _runningInterpolations[runningKey][k as any]);

  // console.log(
  //   "Returning stop signal for",
  //   prevInterpolations.length,
  //   "interpolation(s)",
  // );
  return AnimationProvider.Animated.block(
    // Add stop signal
    prevInterpolations.map(p =>
      AnimationProvider.Animated.set(p.isRunningFlag, RunningFlags.Stopped),
    ),
  );
};

/**
 * @description Updates running flag shadow value on JS side
 * @param itemId
 * @param key
 * @param animationId
 * @param value
 */
export const setInterpolationRunningValue = (
  itemId: number,
  key: string,
  animationId: number,
  value: number,
) => {
  const runningKey = getKey(itemId, key);
  if (!ensureInterpolation(itemId, key, animationId)) return;
  // console.log(
  //   "Interpolation",
  //   animationId,
  //   "for",
  //   itemId,
  //   "key:",
  //   key,
  //   "flag is set to",
  //   value,
  // );
  _runningInterpolations[runningKey][animationId].isRunningShadow = value;
};

/**
 * @description Unregisters a running animation for a transition item and a given key
 * @param itemId TransitionItem id
 * @param key Key that is animated
 * @param animationId Id of the interpolation
 */
export const isInterpolationRunning = (itemId: number, key: string) => {
  const runningKey = getKey(itemId, key);
  if (!_runningInterpolations[runningKey]) return false;

  const animationIds = Object.keys(_runningInterpolations[runningKey]);
  return (
    animationIds
      .map(id => _runningInterpolations[runningKey][id as any])
      .find(ip => ip.isRunningShadow !== RunningFlags.Stopped) !== undefined
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

  return true;
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
