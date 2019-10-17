import { createProc } from "../../Functions/createProc";
import {
  AnimationProvider,
  InterpolateFunction,
  IAnimationValue,
} from "react-native-fluid-animations";
import { EasingFunction } from "../../../Components/Types/Easing";

const {
  proc,
  eq,
  cond,
  lessThan,
  set,
  greaterThan,
  block,
} = AnimationProvider.Animated;

export enum Extrapolate {
  Extend = 0,
  Identity = 1,
  Clamp = 2,
}

export const getInterpolatorFunction = (
  interpolateInternal: InterpolateFunction,
  key: string,
  easingFunction: EasingFunction = (t: any) => t,
  easingKey: string = "linear",
) => {
  return createProc(`interpolate${easingKey}-${key}`, () =>
    proc(
      `interpolate${easingKey}-${key}`,
      (
        inputValue,
        inputMin,
        inputMax,
        outputMin,
        outputMax,
        extrapolateLeft,
        extrapolateRight,
        outputValue,
      ) => {
        const interpolateFunc = interpolateInternal(
          easingFunction(inputValue),
          inputMin,
          inputMax,
          outputMin,
          outputMax,
        );

        return block([
          // Check if outputMin is set - it is a copy of the
          // outputRange[0] value
          // debug("inputMin", inputMin),
          // debug("inputMax", inputMax),
          // debug("outputMin", outputMin),
          // debug("outputMax", outputMax),
          cond(
            // Extrapolate left
            lessThan(inputValue, inputMin),
            cond(
              // Identity
              eq(extrapolateLeft, Extrapolate.Identity),
              [
                // Return input value without easing
                set(outputValue as IAnimationValue, inputValue),
              ],
              // Clamp
              cond(
                eq(extrapolateLeft, Extrapolate.Clamp),
                [
                  // Return inputMin
                  set(outputValue as IAnimationValue, outputMin),
                ],
                [
                  // Extend - return interpolated value
                  set(outputValue as IAnimationValue, interpolateFunc),
                ],
              ),
            ),
            // Extrapolate right
            cond(
              greaterThan(inputValue, inputMax),
              cond(
                // Identity
                eq(extrapolateRight, Extrapolate.Identity),
                [
                  // Return input value
                  set(outputValue as IAnimationValue, inputValue),
                ],
                // Clamp
                cond(
                  eq(extrapolateRight, Extrapolate.Clamp),
                  [
                    // Return input max
                    set(outputValue as IAnimationValue, outputMax),
                  ],
                  [
                    // Extend
                    set(outputValue as IAnimationValue, interpolateFunc),
                  ],
                ),
              ),
              [
                // Interpolate
                set(outputValue as IAnimationValue, interpolateFunc),
              ],
            ),
          ),
        ]);
      },
    ),
  );
};
