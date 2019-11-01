import { ConfigType } from ".";
import {
  ConfigValueInterpolationType,
  ConfigInterpolatorType,
  ConfigStyleInterpolationType,
} from "./Types";

export const Interpolation = (
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
