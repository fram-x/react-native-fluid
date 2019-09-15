import React, { Context } from "react";
import { ChildAnimationDirection } from "../../Configuration";

export interface ConfigurationContextType {
  getChildDirection: () => ChildAnimationDirection | undefined;
}

export const ConfigurationContext: Context<ConfigurationContextType | null> = React.createContext<ConfigurationContextType | null>(
  null
);
