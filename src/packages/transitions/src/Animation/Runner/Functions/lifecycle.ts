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
  neq,
  block,
  cond,
  eq,
  and,
  greaterOrEq,
} = AnimationProvider.Animated;

// const debug = (_: string, a: any) => a;

export enum StopReason {
  DurationEnd = 0,
  Removed = 1,
}

const getAnimationKey = (ownerId: number, key: string) => `${key}(${ownerId})`;

export const stopAnimation = (ownerId: number, key: string) => {
  const animationKey = getAnimationKey(ownerId, key);
  if (_runningAnimations[animationKey]) {
    _runningAnimationShadows[animationKey] = false;
    _removedAnimation[animationKey] = true;
    _runningAnimations[animationKey].setValue(1);
  }
};

export const IsAnimationRemoved = (ownerId: number, key: string) => {
  const animationKey = getAnimationKey(ownerId, key);
  return _removedAnimation[animationKey] === true;
};

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

  onBegin &&
    registerBeginListener(animationId, (id: number) => {
      _runningAnimationShadows[animationKey] = true;
      _removedAnimation[animationKey] = false;
      onBegin && onBegin(id);
    });

  onEnd &&
    registerEndListener(animationId, (id: number, stopReason: StopReason) => {
      onEnd && onEnd(id, stopReason);
      _runningAnimationShadows[animationKey] = false;
    });

  const started = AnimationProvider.createValue(0);
  const stopped = AnimationProvider.createValue(0);

  const previousStopFlag =
    _runningAnimations[animationKey] || AnimationProvider.createValue(-1);
  _runningAnimations[animationKey] = stopped;

  const f = lifecycleFunc(
    animationId,
    ownerId,
    normalize(source, offset, duration),
    started,
    stopped,
    previousStopFlag,
    updateValue,
  );

  return () => f;
};

const _runningAnimations: { [key: string]: IAnimationValue } = {};
const _runningAnimationShadows: { [key: string]: boolean } = {};
const _removedAnimation: { [key: string]: boolean } = {};
const _beginListeners: { [key: number]: Array<(id: number) => void> } = {};
const _endListeners: {
  [key: number]: Array<(id: number, stopReason: number) => void>;
} = {};

const registerBeginListener = (id: number, callback: (id: number) => void) => {
  if (!_beginListeners[id]) {
    _beginListeners[id] = [];
  }
  _beginListeners[id].push(callback);
};

const registerEndListener = (
  id: number,
  callback: (id: number, stopReason: StopReason) => void,
) => {
  if (!_endListeners[id]) {
    _endListeners[id] = [];
  }
  _endListeners[id].push(callback);
};

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

const lifecycleFunc = createProc("lifecycle", () =>
  proc(
    "lifecycle",
    (animationId, ownerId, input, started, stopped, previousStopFlag, output) =>
      block([
        // Check if we haven't started but we have reached the start
        cond(
          and(greaterOrEq(input, 0), eq(started, 0), eq(stopped, 0)),
          cond(eq(started, 0), [
            // Stop previous animation
            cond(neq(previousStopFlag, -1), [
              set(previousStopFlag as IAnimationValue, 1),
            ]),
            // Mark as started
            set(started as IAnimationValue, 1),
            // Call on begin
            call([animationId, ownerId], onAnimationBegin),
          ]),
        ),

        // Check if stopped value has been changed
        cond(and(eq(started, 1), eq(stopped, 1)), [
          // We are stopped from the outside
          call([animationId, ownerId, stopped], onAnimationEnd),
          set(started as IAnimationValue, 0),
        ]),
        // Now we can evaluate wether or not we should update
        // the value with the setValue call proc node
        cond(and(eq(started, 1), eq(stopped, 0)), [output]),
        // Check for end value reached
        cond(and(eq(started, 1), eq(stopped, 0), greaterOrEq(input, 1)), [
          // Callback when done
          call([animationId, ownerId, stopped], onAnimationEnd),
          // Mark as stopped
          set(stopped as IAnimationValue, 1),
        ]),
      ]),
  ),
);
