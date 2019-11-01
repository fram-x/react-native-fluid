import { ConfigType } from "../Configuration";

import { useFluidConfig } from "./useFluidConfig";
import {
  ConfigValueInterpolationType,
  ConfigInterpolatorType,
  ConfigStyleInterpolationType,
} from "../Configuration/Types";

export const useInterpolation = (
  value: ConfigInterpolatorType,
  interpolation:
    | ConfigStyleInterpolationType
    | Array<ConfigStyleInterpolationType>,
): ConfigType => {
  const resolvedInterpolations =
    interpolation instanceof Array ? interpolation : [interpolation];
  return useFluidConfig({
    interpolation: resolvedInterpolations.map(
      i =>
        ({
          ...i,
          value,
        } as ConfigValueInterpolationType),
    ),
  });
};
