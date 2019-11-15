import {
  IAnimationNode,
  AnimationProvider,
} from "react-native-fluid-animations";
import { createProc } from "../../Functions/createProc";

const { proc, add, multiply, divide, sub } = AnimationProvider.Animated;

const interpolateValueProc = createProc("interpolateValue", () =>
  proc(
    "interpolateValue",
    (inputValue, inputMin, inputMax, outputMin, outputMax) =>
      add(
        outputMin,
        multiply(
          divide(sub(inputValue, inputMin), sub(inputMax, inputMin)),
          sub(outputMax, outputMin),
        ),
      ),
  ),
);

export const interpolateValue = (
  input: IAnimationNode,
  inputMin: any,
  inputMax: any,
  outputMin: any,
  outputMax: any,
) => {
  return interpolateValueProc(input, inputMin, inputMax, outputMin, outputMax);
};

Object.defineProperty(interpolateValue, "interpolationKey", {
  writable: false,
  value: "value",
});
