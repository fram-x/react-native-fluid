import {
  IAnimationValue,
  IAnimationNode,
  ExtrapolateType
} from "react-native-fluid-transitions";
import { OnAnimationFunction } from "./InterpolationTypes";
import { ConfigAnimationType } from "../../Configuration";
import { ValueDescriptorsType } from "../../Types";

export type Values = { [key: string]: any };

export type ValueContextType = {
  previousKeys: string[];
  previousValues: Values;
  nextKeys: string[];
  nextValues: Values;
  current: () => ValueTypeEntries;
  descriptors: ValueDescriptorsType;
  isChanged: boolean;
  addInterpolation: (
    interpolator: IAnimationNode,
    key: string,
    inputValues: Array<number> | undefined,
    outputValues: Array<string | number>,
    extrapolate?: ExtrapolateType,
    extrapolateLeft?: ExtrapolateType,
    extrapolateRight?: ExtrapolateType
  ) => void;
  addAnimation: (
    key: string,
    inputRange: Array<number> | undefined,
    outputRange: Array<string | number | undefined>,
    animationType?: ConfigAnimationType,
    onAnimationDone?: OnAnimationFunction,
    onAnimationBegin?: OnAnimationFunction,
    extrapolate?: ExtrapolateType,
    extrapolateLeft?: ExtrapolateType,
    extrapolateRight?: ExtrapolateType,
    loop?: number,
    flip?: number,
    yoyo?: number
  ) => void;
};

export type ValueType = {
  interpolator: IAnimationValue;
  display: IAnimationNode;
  isSet: boolean;
  isInterpolatable: boolean;
};

export type ValueTypeEntries = { [key: string]: ValueType };
