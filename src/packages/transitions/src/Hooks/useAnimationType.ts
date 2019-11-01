import { ConfigType, ConfigAnimationType } from "../Configuration/Types";

export const useAnimationType = (
  animation: ConfigAnimationType,
): ConfigType => {
  return { animation };
};
