import { Interpolations } from "./types";
import { addInterpolation } from "./Runner/addInterpolation";

export const commitInterpolations = (interpolations: Interpolations) => {
  interpolations.forEach(interpolation => {
    addInterpolation(
      interpolation.interpolator,
      interpolation.interpolationInfo
    );
  });
};
