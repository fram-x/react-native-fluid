import { ConfigType } from "../Configuration";
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
  return {
    interpolation: resolvedInterpolations.map(
      i =>
        ({
          ...i,
          value,
        } as ConfigValueInterpolationType),
    ),
  };
};
