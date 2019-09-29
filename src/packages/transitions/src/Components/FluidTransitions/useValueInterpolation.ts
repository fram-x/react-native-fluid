import {
  ValueContextType,
  TransitionItem,
  Values,
  OnAnimationFunction,
} from "../Types";
import { ConfigAnimationType } from "../../Configuration";

export const useValueInterpolation = (
  _transitionItem: TransitionItem,
  styleContext: ValueContextType,
  propContext: ValueContextType,
  animationType?: ConfigAnimationType,
  onAnimationDone?: OnAnimationFunction,
  onAnimationBegin?: OnAnimationFunction,
) => {
  if (styleContext.isChanged) {
    createInterpolations(
      styleContext,
      animationType,
      onAnimationBegin,
      onAnimationDone,
    );
  }
  if (propContext.isChanged) {
    createInterpolations(
      propContext,
      animationType,
      onAnimationBegin,
      onAnimationDone,
    );
  }
};

const createInterpolations = (
  context: ValueContextType,
  animationType?: ConfigAnimationType,
  onAnimationBegin?: OnAnimationFunction,
  onAnimationDone?: OnAnimationFunction,
) => {
  const interpolations: Values = {};
  // Find all prop values that needs interpolation
  context.nextKeys.forEach(key => {
    if (context.previousValues[key] !== context.nextValues[key]) {
      interpolations[key] = context.nextValues[key];
    }
  });

  if (Object.keys(interpolations).length === 0) return;

  Object.keys(interpolations).forEach(key => {
    if (context.descriptors[key]) {
      context.addAnimation(
        key,
        undefined,
        [
          context.previousValues[key] !== undefined
            ? undefined
            : context.descriptors[key].defaultValue,
          context.nextValues[key],
        ],
        animationType || context.descriptors[key].defaultAnimation,
        onAnimationBegin,
        onAnimationDone,
        context.descriptors[key].extrapolate,
      );
    }
  });
};
