import React from "react";
import { IAnimationValue } from "../../../../animated/dist";

export type DriverContextType = {
  driver: IAnimationValue;
  requestDuration: (duration: number) => void;
};

export const DriverContext = React.createContext<DriverContextType | undefined>(
  undefined,
);
