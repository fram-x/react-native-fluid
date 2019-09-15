import React, { Context } from "react";
import { InterpolationInfo } from "./InterpolationTypes";
import { IAnimationNode } from "react-native-fluid-animations";

export type AnimationContextType = {
  isInAnimationContext: () => boolean;
  registerAnimation: (interpolationInfo: InterpolationInfo) => void;
  registerInterpolation: (
    interpolator: IAnimationNode,
    interpolationInfo: InterpolationInfo
  ) => void;
};

export const AnimationContext: Context<AnimationContextType | null> = React.createContext<AnimationContextType | null>(
  null
);
