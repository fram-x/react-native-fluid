import { mergeConfigs, ConfigType } from "../Configuration";
import { useFluidConfig } from "./useFluidConfig";

export const useMergedConfigs = (...configs: ConfigType[]): ConfigType => {
  return useFluidConfig(mergeConfigs(...configs));
};
