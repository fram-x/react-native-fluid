import { getLifecycleFunc } from "./lifecycle";
import { normalize } from "./normalize";
import { getSetAnimationValue } from "./setAnimationValue";
import {
  AnimationProvider,
  IAnimationNode,
  ExtrapolateType,
  IAnimationValue,
  InterpolateFunction,
} from "react-native-fluid-animations";
import { getExtrapolationValue } from "./getExtrapolationValue";
import { EasingFunction } from "../../../Components/Types/Easing";
import {
  registerRunningInterpolation,
  RunningFlags,
  unregisterRunningInterpolation,
  setInterpolationRunningValue,
  getStopPreviousAnimationNode,
} from "../interpolationStorage";
import { createProc } from "../../Functions";
const {
  lessThan,
  greaterOrEq,
  and,
  set,
  block,
  always,
  cond,
  proc,
  js,
} = AnimationProvider.Animated;

export const createAnimationNode = (
  source: IAnimationNode,
  target: IAnimationValue,
  animationId: number,
  key: string,
  ownerId: number,
  offset: number,
  duration: number,
  easingFunction: EasingFunction,
  easingKey: string,
  inputRange: Array<number>,
  outputRange: Array<number | string | IAnimationNode>,
  extrapolate: ExtrapolateType | undefined,
  extrapolateLeft: ExtrapolateType | undefined,
  extrapolateRight: ExtrapolateType | undefined,
  onBegin: (() => void) | undefined,
  onEnd: (() => void) | undefined,
  interpolate: InterpolateFunction,
  isExternalDriver: () => boolean,
) => {
  // Build interpolations if range has more items than two
  const elements: Array<IAnimationNode> = [];

  // Start value - need to be copied
  const outputStart = AnimationProvider.createValue(Number.MIN_VALUE);

  // Resolve extrapolate left
  const extrapolateLeftValue = AnimationProvider.createValue(
    getExtrapolationValue(extrapolateLeft || extrapolate || "extend"),
  );

  // Resolve extrapolate right
  const extrapolateRightValue = AnimationProvider.createValue(
    getExtrapolationValue(extrapolateRight || extrapolate || "extend"),
  );

  // Create is running flag
  const isRunningFlag = AnimationProvider.createValue(RunningFlags.NotStarted);

  // Build javascript for running interpolation
  const getInterpolatedValue = createProc("createAnimationNode", () => {
    const func = `
    function (
      source, 
      offset, 
      duration,            
      target,   
      value,        
    ) {
      // Normalize function
      const normalize = function(source, offset, duration) {
        if((source-offset)/duration > 1.0) {
          return 1.0;
        }
        return (source-offset)/duration;
      }
      
      if(source >= offset && source <= offset+duration){
        // Interpolate value        
        return value;
      } else {
        // Just return the target value, no need to update anymore
        return target;
      }
    }`;
    return proc(
      "createAnimationNode",
      (s, o, d, t, i, inmin, inmax, outmin, outmax) => {
        return js(func, s, o, d, t, i(s, inmin, inmax, outmin, outmax));
      },
    );
  });

  const outputMin = AnimationProvider.createValue(outputRange[0]);

  // Create updater
  const setAnimatedValue = always(() =>
    set(
      target,
      getInterpolatedValue(
        source,
        offset,
        duration,
        target,
        interpolate,
        inputRange[0],
        inputRange[1],
        outputRange[0],
        outputRange[1],
      ),
    ),
  );

  registerRunningInterpolation(
    ownerId,
    key,
    animationId,
    source as IAnimationValue,
    setAnimatedValue,
    isRunningFlag,
    RunningFlags.NotStarted,
  );

  return setAnimatedValue;

  // return;

  // Get set function
  /*const setAnimationValueFunc = getSetAnimationValue(
    interpolate,
    key,
    easingFunction,
    easingKey,
  );

  if (inputRange.length === 2) {
    // Push first element in interpolation
    elements.push(
      setAnimationValueFunc(
        source,
        offset,
        duration,
        target,
        inputRange[0],
        inputRange[1],
        outputRange[0],
        outputRange[1],
        extrapolateLeftValue,
        extrapolateRightValue,
        outputStart,
      ),
    );
  } else {
    // Push the rest (if any)
    const normalizeFunc = normalize(source, offset, duration);

    for (let i = 0; i < inputRange.length - 1; i++) {
      elements.push(
        cond(
          and(
            i === 0
              ? true
              : greaterOrEq(easingFunction(normalizeFunc), inputRange[i]),
            i === inputRange.length - 2
              ? true
              : lessThan(easingFunction(normalizeFunc), inputRange[i + 1]),
          ),
          setAnimationValueFunc(
            source,
            offset,
            duration,
            target,
            inputRange[i],
            inputRange[i + 1],
            outputRange[i],
            outputRange[i + 1],
            extrapolateLeftValue,
            extrapolateRightValue,
            i === 0 ? outputStart : outputRange[i],
          ),
        ),
      );
    }
  }

  // Find the element for setting value
  const interpolateNode = elements.length === 1 ? elements[0] : block(elements);

  const onBeginCallback = (_id: number) => {
    setInterpolationRunningValue(
      ownerId,
      key,
      animationId,
      RunningFlags.Started,
    );
    onBegin && onBegin();
  };

  const onEndCallback = (_id: number, _reason: number) => {
    if (!isExternalDriver()) {
      unregisterRunningInterpolation(ownerId, key, animationId);
      onEnd && onEnd();
    }
  };

  // Create is running flag
  const isRunningFlag = AnimationProvider.createValue(RunningFlags.NotStarted);

  // Get statement for removing previous nodes
  const stopPrevAnimationsNode = isExternalDriver()
    ? 0
    : getStopPreviousAnimationNode(ownerId, key, animationId);

  // Build lifecycle function
  const lifecycleFunc = getLifecycleFunc(
    ownerId,
    key,
    animationId,
    source,
    offset,
    duration,
    onBeginCallback,
    onEndCallback,
    interpolateNode,
    isRunningFlag,
    stopPrevAnimationsNode,
  );

  const animationFrameNode = always(lifecycleFunc);
  registerRunningInterpolation(
    ownerId,
    key,
    animationId,
    source as IAnimationValue,
    animationFrameNode,
    isRunningFlag,
    RunningFlags.NotStarted,
  );
  return animationFrameNode;*/
};
