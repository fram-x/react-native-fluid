import { getLifecycleFunc, StopReason } from "./lifecycle";
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
const {
  lessThan,
  greaterOrEq,
  and,
  block,
  always,
  attach,
  detach,
  cond,
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

  // Get set function
  const setAnimationValueFunc = getSetAnimationValue(
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

  // Build lifecycle function
  const lifecycleFunc = getLifecycleFunc(
    ownerId,
    key,
    animationId,
    source,
    offset,
    duration,
    (_id: number) => onBegin && onBegin(),
    (_id: number, _stopReason: StopReason) => {
      detach(source as IAnimationValue, animationFrameNode);
      onEnd && onEnd();
    },
    // Now let's update the target node with the results from the
    // interpolation (including easing)
    interpolateNode,
  );

  const animationFrameNode = always(lifecycleFunc);
  attach(source as IAnimationValue, animationFrameNode);
  return animationFrameNode;
};
