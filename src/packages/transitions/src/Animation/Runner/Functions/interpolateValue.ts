import {
  IAnimationNode,
  AnimationProvider,
} from "react-native-fluid-animations";
import { createProc } from "../../Functions/createProc";

const { proc, js } = AnimationProvider.Animated;

const interpolateValueProc = createProc("interpolateValue", () =>
  proc(
    "interpolateValue",
    (inputValue, inputMin, inputMax, outputMin, outputMax) =>
      js(
        `function(
          inputValue, 
          inputMin, 
          inputMax, 
          outputMin, 
          outputMax) {
          return outputMin + 
            ((inputValue - inputMin) / (inputMax - inputMin)) * 
            (outputMax - outputMin)
        }`,
        inputValue,
        inputMin,
        inputMax,
        outputMin,
        outputMax,
      ),
    // add(
    //   outputMin,
    //   multiply(
    //     divide(sub(inputValue, inputMin), sub(inputMax, inputMin)),
    //     sub(outputMax, outputMin)
    //   )
    // )
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
