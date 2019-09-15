import { getInterpolatorFunction } from "./interpolate";
import {
  InterpolateFunction,
  AnimationProvider
} from "react-native-fluid-animations";
import { createProc } from "../../Functions/createProc";
const { proc } = AnimationProvider.Animated;

export const getSetInterpolationValue = (
  interpolateInternal: InterpolateFunction,
  key: string
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
        extrapolateRight
      ) =>
        interpolate(
          source,
          inputMin,
          inputMax,
          outputMin,
          outputMax,
          extrapolateLeft,
          extrapolateRight,
          target
        )
    )
  );
};
