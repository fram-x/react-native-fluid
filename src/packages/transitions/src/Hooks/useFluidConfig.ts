import { createConfig, ConfigType, mergeConfigs } from "../Configuration";
import { useRef } from "react";

export const useFluidConfig = (...config: ConfigType[]) => {
  const resolvedConfig =
    config.length > 0 ? mergeConfigs(...config) : config[0];

  const configRef = useRef(resolvedConfig);
  if (configRef.current !== resolvedConfig) {
    configRef.current = createConfig(resolvedConfig);
  }
  return configRef.current;
};
