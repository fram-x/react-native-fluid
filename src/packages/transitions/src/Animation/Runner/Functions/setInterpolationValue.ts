import { getInterpolatorFunction } from "./interpolate";
import {
  InterpolateFunction,
  AnimationProvider,
  IAnimationValue,
} from "react-native-fluid-animations";
import { createProc } from "../../Functions/createProc";
const { proc, block, cond, eq, set } = AnimationProvider.Animated;

export const getSetInterpolationValue = (
  interpolateInternal: InterpolateFunction,
  key: string,
) => {
  const interpolate = getInterpolatorFunction(interpolateInternal, key);

  return createProc(`setInterpolationValue_${key}`, () =>
    proc(
      `setInterpolationValue_${key}`,
      (
        source,
        target,
        inputMin,
        inputMax,
        outputMin,
        outputMax,
        extrapolateLeft,
        extrapolateRight,
        isStarted,
        removePreviousStatement,
      ) =>
        block([
          cond(eq(isStarted, 0), [
            set(isStarted as IAnimationValue, 1),
            removePreviousStatement,
          ]),
          interpolate(
            source,
            inputMin,
            inputMax,
            outputMin,
            outputMax,
            extrapolateLeft,
            extrapolateRight,
            target,
          ),
        ]),
    ),
  );
};
