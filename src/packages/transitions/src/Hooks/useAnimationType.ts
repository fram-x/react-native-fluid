import { useFluidConfig } from "./useFluidConfig";
import { ConfigType, ConfigAnimationType } from "../Configuration/Types";

export const useAnimationType = (
  animation: ConfigAnimationType,
): ConfigType => {
  return useFluidConfig({ animation });
};
