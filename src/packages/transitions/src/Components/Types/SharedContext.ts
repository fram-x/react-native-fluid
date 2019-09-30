import React, { Context } from "react";
import { TransitionItem } from "./TransitionItem";
import { OnAnimationFunction } from "./InterpolationTypes";
import { ConfigAnimationType } from "../../Configuration";

export interface SharedInterpolationContextType {
  registerSharedInterpolation: (
    transitionItem: TransitionItem,
    fromLabel: string,
    toLabel: string,
    animation?: ConfigAnimationType,
    onBegin?: OnAnimationFunction,
    onEnd?: OnAnimationFunction,
  ) => void;
  registerSharedInterpolationInfo: (fromLabel: string, toLabel: string) => void;
}

export const SharedInterpolationContext: Context<SharedInterpolationContextType | null> = React.createContext<SharedInterpolationContextType | null>(
  null,
);
