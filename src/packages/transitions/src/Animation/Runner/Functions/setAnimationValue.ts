import { getInterpolatorFunction } from "./interpolate";
import { normalize } from "./normalize";
import {
  InterpolateFunction,
  AnimationProvider,
  IAnimationValue,
} from "react-native-fluid-animations";
import { createProc } from "../../Functions/createProc";
import { EasingFunction } from "../../../Components/Types";
const { cond, set, eq, proc } = AnimationProvider.Animated;

export const getSetAnimationValue = (
  interpolateInternal: InterpolateFunction,
  key: string,
  easingFunction: EasingFunction,
  easingKey: string,
) => {
  const interpolate = getInterpolatorFunction(
    interpolateInternal,
    key,
    easingFunction,
    easingKey,
  );

  return createProc(`setAnimationValue_${easingKey}-${key}`, () =>
    proc(
      `setAnimationValue_${easingKey}-${key}`,
      (
        source,
        offset,
        duration,
        target,
        inputMin,
        inputMax,
        outputMin,
        outputMax,
        extrapolateLeft,
        extrapolateRight,
        outputStart,
      ) =>
        // Copy start output range - this is needed since it might be
        // the tracker itself
        cond(
          eq(outputStart, Number.MIN_VALUE),
          // if outputStart is Minvalue then
          set(outputStart as IAnimationValue, outputMin),
          // else Interpolate
          interpolate(
            normalize(source, offset, duration),
            inputMin,
            inputMax,
            outputStart,
            outputMax,
            extrapolateLeft,
            extrapolateRight,
            target,
          ),
        ),
    ),
  );
};
