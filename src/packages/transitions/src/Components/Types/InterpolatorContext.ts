import React, { Context } from "react";
import { IAnimationNode } from "react-native-fluid-animations";

export type PartialInterpolatorInfo = {
  interpolators: { [key: string]: IAnimationNode };
  props: Object;
};

export type InterpolatorInfo = PartialInterpolatorInfo & {
  label: string;
};

export type MasterInterpolatorInfo = {
  interpolator: IAnimationNode;
};

export interface InterpolatorContextType {
  getInterpolator: (label: string, name: string) => IAnimationNode | undefined;
  registerInterpolator: (interpolator: InterpolatorInfo) => void;
}

export const InterpolatorContext: Context<InterpolatorContextType | null> = React.createContext<InterpolatorContextType | null>(
  null
);
