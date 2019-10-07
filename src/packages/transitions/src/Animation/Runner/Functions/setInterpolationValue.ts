import { getInterpolatorFunction } from "./interpolate";
import {
  InterpolateFunction,
  AnimationProvider,
  IAnimationValue,
} from "react-native-fluid-animations";
import { createProc } from "../../../Animation/Functions";
import { RunningFlags } from "../interpolations";
const { cond, proc, set, eq } = AnimationProvider.Animated;

export const getSetInterpolationValue = (
  interpolateInternal: InterpolateFunction,
  isRunningFlag: IAnimationValue,
  key: string,
) => {
  const interpolateFunc = getInterpolatorFunction(interpolateInternal, key);

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
      ) =>
        cond(
          eq(isRunningFlag, RunningFlags.NotStarted),
          [
            // Update running flag
            set(isRunningFlag, RunningFlags.Started),
          ],
          // Update if we are running
          cond(
            eq(isRunningFlag, 1),
            // Update!
            interpolateFunc(
              source,
              inputMin,
              inputMax,
              outputMin,
              outputMax,
              extrapolateLeft,
              extrapolateRight,
              target,
            ),
          ),
        ),
    ),
  );
};
