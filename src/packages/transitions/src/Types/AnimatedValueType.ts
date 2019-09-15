import {
  IAnimationNode,
  IAnimationValue,
  ExtrapolateType
} from "react-native-fluid-animations";
import { ConfigAnimationType } from "../Configuration";

export type DescriptorType = "regular" | "array";

export type ValueDescriptorType = {
  defaultValue: number | string;
  getNumericValue: (p: any) => any;
  getDisplayValue: (input: IAnimationValue) => IAnimationNode;
  defaultAnimation: ConfigAnimationType;
  extrapolate: ExtrapolateType;
  valueType?: DescriptorType;
  interpolate: (
    input: IAnimationNode,
    inputMin: any,
    inputMax: any,
    outputMin: any,
    outputMax: any
  ) => any;
};

export type ValueDescriptorsType = {
  [key: string]: ValueDescriptorType;
};
