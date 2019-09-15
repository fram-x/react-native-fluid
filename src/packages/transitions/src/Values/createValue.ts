import { ValueType } from "../Components/Types";
import {
  AnimationProvider,
  IAnimationValue,
} from "react-native-fluid-animations";
import { ValueDescriptorType } from "../Types/AnimatedValueType";

export const createValue = (
  initialValue: any,
  valueDescriptor?: ValueDescriptorType,
): ValueType => {
  if (!valueDescriptor) {
    return {
      isSet: true,
      isInterpolatable: false,
      interpolator: initialValue,
      display: initialValue,
    };
  }

  // Create the interpolator - it should have a numeric representation of the
  // value of the style to make sure we can easily interpolate it - or if
  // it is an animated value (might happen as well) - we don't need to
  // convert to a number before we continue.
  let interpolator: IAnimationValue;
  if (AnimationProvider.isAnimatedNode(initialValue)) {
    interpolator = AnimationProvider.createValue(initialValue);
  } else {
    interpolator = AnimationProvider.createValue(
      valueDescriptor.getNumericValue(initialValue),
    );
  }

  // Create the interpolatable style info value
  return {
    isSet: true,
    isInterpolatable: true,
    interpolator,
    display: valueDescriptor.getDisplayValue(interpolator),
  };
};
