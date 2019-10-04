import {
  AnimationProvider,
  IAnimationNode,
  ExtrapolateType,
  IAnimationValue,
  InterpolateFunction,
} from "react-native-fluid-animations";
import { getExtrapolationValue } from "./getExtrapolationValue";
import { getSetInterpolationValue } from "./setInterpolationValue";
const {
  lessThan,
  lessOrEq,
  greaterOrEq,
  debug,
  and,
  block,
  always,
  attach,
  cond,
} = AnimationProvider.Animated;

export const createInterpolationNode = (
  source: IAnimationNode,
  target: IAnimationValue,
  key: string,
  inputRange: Array<number>,
  outputRange: Array<number | string | IAnimationNode>,
  extrapolate: ExtrapolateType | undefined,
  extrapolateLeft: ExtrapolateType | undefined,
  extrapolateRight: ExtrapolateType | undefined,
  interpolate: InterpolateFunction,
) => {
  // Build interpolations if range has more items than two
  const elements: Array<IAnimationNode> = [];

  // Resolve extrapolate left
  const extrapolateLeftValue = AnimationProvider.createValue(
    getExtrapolationValue(extrapolateLeft || extrapolate || "extend"),
  );

  // Resolve extrapolate right
  const extrapolateRightValue = AnimationProvider.createValue(
    getExtrapolationValue(extrapolateRight || extrapolate || "extend"),
  );

  // Get set function
  const setInterpolationValueFunc = getSetInterpolationValue(interpolate, key);

  if (inputRange.length === 2) {
    // Push first element in interpolation
    elements.push(
      setInterpolationValueFunc(
        source,
        target,
        inputRange[0],
        inputRange[1],
        outputRange[0],
        outputRange[1],
        extrapolateLeftValue,
        extrapolateRightValue,
      ),
    );
  } else {
    // Push the rest (if any)
    for (let i = 0; i < inputRange.length - 1; i++) {
      elements.push(
        cond(
          and(
            greaterOrEq(source, inputRange[i]),
            i === inputRange.length - 2
              ? lessOrEq(source, inputRange[i + 1])
              : lessThan(source, inputRange[i + 1]),
          ),
          [
            setInterpolationValueFunc(
              source,
              target,
              inputRange[i],
              inputRange[i + 1],
              outputRange[i],
              outputRange[i + 1],
              extrapolateLeftValue,
              extrapolateRightValue,
            ),
          ],
        ),
      );
    }
  }

  const interpolateNode = always(() =>
    elements.length === 1 ? elements[0] : block(elements),
  );

  return interpolateNode;
};
