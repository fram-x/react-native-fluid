import { Extrapolate } from "./interpolate";
import { ExtrapolateType } from "react-native-fluid-animations";

export const getExtrapolationValue = (
  extrapolate: ExtrapolateType
): Extrapolate => {
  switch (extrapolate) {
    case "clamp":
      return Extrapolate.Clamp;
    case "extend":
      return Extrapolate.Extend;
    case "identity":
      return Extrapolate.Identity;
  }
};
