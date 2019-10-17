import {
  TransitionItem,
  ValueContextType,
  InterpolatorContextType,
} from "../Types";
import { fluidException } from "../../Types";
import { SafeStateConfigType } from "../../Configuration";

export const useInterpolatorConfig = (
  _transitionItem: TransitionItem,
  styleContext: ValueContextType,
  _propContext: ValueContextType,
  interpolatorContext: InterpolatorContextType,
  configuration: SafeStateConfigType,
) => {
  const interpolations = configuration.interpolation;
  interpolations.forEach(interpolation => {
    if (!interpolation.value) {
      throw fluidException(
        "A configuration interpolation needs an interpolator.",
      );
    }
    const { ownerLabel, valueName } = interpolation.value;
    const interpolator = interpolatorContext.getInterpolator(
      ownerLabel,
      valueName,
    );
    if (!interpolator) {
      throw fluidException(
        "Could not find interpolator " +
          valueName +
          " in item with label " +
          ownerLabel +
          ".",
      );
    }

    const {
      styleKey,
      inputRange,
      outputRange,
      extrapolate,
      extrapolateLeft,
      extrapolateRight,
    } = interpolation;

    // Set up styles with interpolations
    styleContext.addInterpolation(
      interpolator,
      styleKey,
      inputRange,
      outputRange,
      extrapolate,
      extrapolateLeft,
      extrapolateRight,
    );
  });
};
