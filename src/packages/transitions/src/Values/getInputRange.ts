import { fluidException } from "../Types";

export const getInputRange = (
  inputRange: Array<number> | undefined,
  outputRange: Array<any>
): Array<number> => {
  if (inputRange !== undefined && inputRange.length !== outputRange.length) {
    throw fluidException(
      `Input values and output values must not differ in length. Got ${outputRange.length} in the output when the input was ${inputRange.length}.`
    );
  }

  if (inputRange !== undefined) {
    for (let i = 1; i < inputRange.length; ++i) {
      if (!(inputRange[i] >= inputRange[i - 1])) {
        throw fluidException(
          "inputRange must be monotonically non-decreasing."
        );
      }
    }
    return inputRange;
  }

  // calculate (inputRange is not set)
  return outputRange.map((_, index) => index * (1 / (outputRange.length - 1)));
};
