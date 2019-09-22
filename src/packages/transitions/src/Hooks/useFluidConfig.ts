import { createConfig, ConfigType } from "../Configuration";
import { useRef } from "react";

export const useFluidConfig = (config: ConfigType) => {
  const configRef = useRef(config);
  if (configRef.current !== config) {
    configRef.current = createConfig(config);
  }
  return configRef.current;
};
