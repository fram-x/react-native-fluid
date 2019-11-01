import { mergeConfigs, ConfigType, SafeConfigType } from "../Configuration";
export const useMergedConfigs = (...configs: ConfigType[]): SafeConfigType => {
  return mergeConfigs(...configs);
};
