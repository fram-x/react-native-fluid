import { createProc } from "../../Functions/createProc";
import {
  AnimationProvider,
  IAnimationNode,
  IAnimationValue,
} from "react-native-fluid-animations";
import { normalize } from "./normalize";

const {
  proc,
  set,
  call,
  debug,
  block,
  cond,
  eq,
  and,
  greaterOrEq,
  lessOrEq,
} = AnimationProvider.Animated;

export enum StopReason {
  DurationEnd = 0,
  Removed = 1,
}

const _animationRunningFlags: {
  [key: string]: { [key: string]: IAnimationValue };
} = {};

const _animationRunningShadowFlags: { [key: string]: boolean } = {};
const _removedAnimation: { [key: string]: boolean } = {};
const _beginListeners: { [key: number]: Array<(id: number) => void> } = {};
const _endListeners: {
  [key: number]: Array<(id: number, stopReason: number) => void>;
} = {};

const getAnimationKey = (ownerId: number, key: string) => `${key}(${ownerId})`;

/**
 * @description Stops an ongoing animation for a given value key
 * @param ownerId Id of transitionitem owning animation
 * @param key Key for animated value to be stopped
 */
export const stopAnimation = (ownerId: number, key: string) => {
  const animationKey = getAnimationKey(ownerId, key);
  if (_animationRunningFlags[animationKey]) {
    // Mark shadows
    _animationRunningShadowFlags[animationKey] = false;
    _removedAnimation[animationKey] = true;
    // Stop all
    if (_animationRunningFlags[animationKey]) {
      Object.keys(_animationRunningFlags[animationKey]).forEach(k =>
        _animationRunningFlags[animationKey][k].setValue(2),
      );
      _animationRunningFlags[animationKey] = {};
    }
  }
};

/**
 * @description Returns true if the animation has been stopped
 * @param ownerId transitionitem owning the animation
 * @param key key for animation value to be checked
 */
export const IsAnimationRemoved = (ownerId: number, key: string) => {
  const animationKey = getAnimationKey(ownerId, key);
  return _removedAnimation[animationKey] === true;
};

/**
 * @description Creates a new lifecycle proc node for running an animation and
 * keeping track of the lifecycle of the animation
 * @param ownerId id of transitionitem owning the animation
 * @param key Key for animation value to be animated
 * @param animationId id of the animation
 * @param source Animated value driving the animation
 * @param offset offset in ms for starting point of animation
 * @param duration duration in ms for animation
 * @param onBegin optional callback that will be called when animation starts
 * @param onEnd optional callback that will be called when animation ends
 * @param updateValue Statement / proc node to call to update node
 */
export const getLifecycleFunc = (
  ownerId: number,
  key: string,
  animationId: number,
  source: IAnimationNode,
  offset: number,
  duration: number,
  onBegin: (id: number) => void,
  onEnd: (id: number, stopReason: StopReason) => void,
  updateValue: IAnimationNode,
) => {
  const animationKey = getAnimationKey(ownerId, key);

  // Register callbacks for start/stop
  registerBeginListener(animationId, (id: number) => {
    _animationRunningShadowFlags[animationKey] = true;
    _removedAnimation[animationKey] = false;
    onBegin && onBegin(id);
  });

  registerEndListener(animationId, (id: number, stopReason: StopReason) => {
    onEnd && onEnd(id, stopReason);
    if (_animationRunningFlags[animationKey]) {
      delete _animationRunningFlags[animationKey][id];
      _animationRunningShadowFlags[animationKey] = false;
    }
  });

  // Flag for animation running.
  // -1: not initialized, 0: not running, 1: running, 2: stopped from the outside
  const isAnimationRunning = AnimationProvider.createValue(-1);

  // Save previous stop flag so we can stop a previous ongoing
  // animation on the same key
  if (!_animationRunningFlags[animationKey]) {
    _animationRunningFlags[animationKey] = {};
  }

  // Create block that stops previous animations
  const stopPrevious = block(
    Object.keys(_animationRunningFlags[animationKey]).map(k =>
      set(_animationRunningFlags[animationKey][k], 2),
    ),
  );

  // Add next animation to block
  _animationRunningFlags[animationKey][animationId] = isAnimationRunning;

  const f = lifecycleFunc(
    animationId,
    ownerId,
    normalize(source, offset, duration),
    isAnimationRunning,
    stopPrevious,
    updateValue,
  );

  return () => f;
};

/**
 * @description Registers a listener to be called when animation starts
 */
const registerBeginListener = (id: number, callback: (id: number) => void) => {
  if (!_beginListeners[id]) {
    _beginListeners[id] = [];
  }
  _beginListeners[id].push(callback);
};

/**
 * @description Registers a listener to be called when animation ends
 */
const registerEndListener = (
  id: number,
  callback: (id: number, stopReason: StopReason) => void,
) => {
  if (!_endListeners[id]) {
    _endListeners[id] = [];
  }
  _endListeners[id].push(callback);
};

/**
 * @description Callback from native side when an animation starts
 */
const onAnimationBegin = (args: ReadonlyArray<number>) => {
  const animationId = args[0] as number;
  while (
    _beginListeners[animationId] &&
    _beginListeners[animationId].length > 0
  ) {
    const listener = _beginListeners[animationId].pop();
    if (_beginListeners[animationId].length === 0) {
      delete _beginListeners[animationId];
    }
    listener && listener(animationId);
  }
};

/**
 * @description Callback from native side when animation ends
 */
const onAnimationEnd = (args: ReadonlyArray<number>) => {
  const animationId = args[0];
  const stopReason = args[2];
  while (_endListeners[animationId] && _endListeners[animationId].length > 0) {
    const listener = _endListeners[animationId].pop();
    if (_endListeners[animationId].length === 0) {
      delete _endListeners[animationId];
    }
    listener && listener(animationId, stopReason);
  }
};

/**
 * @description Defines the lifecycle function for running an animation
 */
const lifecycleFunc = createProc("lifecycle", () =>
  proc(
    "lifecycle",
    (
      animationId,
      ownerId,
      input,
      isRunning,
      stopPreviousAnimations,
      updateValue,
    ) =>
      block([
        // Start animation
        cond(and(greaterOrEq(input, 0), eq(isRunning, -1)), [
          stopPreviousAnimations,
          set(isRunning as IAnimationValue, 1),
          // debug("Started", isRunning),
          call([animationId, ownerId], onAnimationBegin),
        ]),
        // Check if running value has been changed from the outside
        cond(eq(isRunning, 2), [
          // We are stopped from the outside
          //debug("Stopped from the outside", isRunning),
          call([animationId, ownerId, isRunning], onAnimationEnd),
        ]),
        // Update
        cond(and(greaterOrEq(input, 0), lessOrEq(input, 1)), [updateValue]),
        // Check too see if we should stop
        cond(greaterOrEq(input, 1), [
          // We have started but have now reached the end of the animation
          // debug("STOPPED ANIMATION", animationId),
          // Mark as stopped
          set(isRunning as IAnimationValue, 0),
          // Callback when done
          call([animationId, ownerId, isRunning], onAnimationEnd),
        ]),
      ]),
  ),
);
