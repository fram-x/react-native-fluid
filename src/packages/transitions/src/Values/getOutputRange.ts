import { fluidException } from "../Types";
import { IAnimationNode } from "react-native-fluid-animations";

export const getOutputRange = (
  outputRange: Array<number | string | undefined>,
  currentValue?: IAnimationNode | number | string
): Array<number | string | IAnimationNode> => {
  if (outputRange.length < 2) {
    throw fluidException("Output values must contain more than one element");
  }

  const outputValuesUndefined = outputRange.filter(s => s === undefined);
  if (outputValuesUndefined.length > 1) {
    throw fluidException(
      "Output values must contain only one undefined element"
    );
  }

  if (outputValuesUndefined.length === 1 && currentValue === undefined) {
    throw fluidException(
      "currentValue must be set when outputvalues contain undefined element"
    );
  }

  if (outputValuesUndefined.length === 0) {
    return outputRange as Array<number | string | IAnimationNode>;
  }

  return outputRange.map(i => (i === undefined ? currentValue : i)) as Array<
    number | string | IAnimationNode
  >;
};
