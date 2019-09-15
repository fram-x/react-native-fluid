import {
  IAnimationValue,
  IAnimationNode,
  ExtrapolateType,
  InterpolateFunction
} from "react-native-fluid-animations";
import { EasingFunction } from "./Easing";

export type AnimationInfo = {
  animationId: number;
  key: string;
  ownerId: number;
  inputRange: Array<number>;
  outputRange: Array<number | string | IAnimationNode>;
  target: IAnimationValue;
  duration: number;
  offset: number;
  easing: EasingFunction;
  easingKey?: string;
  previous?: IAnimationValue;
  extrapolate?: ExtrapolateType;
  extrapolateLeft?: ExtrapolateType;
  extrapolateRight?: ExtrapolateType;
  onBegin?: () => void;
  onEnd?: () => void;
  interpolate: InterpolateFunction;
};
