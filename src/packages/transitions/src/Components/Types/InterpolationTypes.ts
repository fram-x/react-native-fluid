import { InterpolateFunction } from "react-native-fluid-animations";
import {
  IAnimationValue,
  InterpolationConfig,
} from "react-native-fluid-animations";
import { TransitionItem } from "./TransitionItem";
import {
  ConfigAnimationType,
  ChildAnimationDirection,
} from "../../Configuration";

export enum SharedInterpolationStatus {
  Created = "Created",
  Preparing = "Preparing",
  Active = "Active",
  Removing = "Removing",
  Done = "Done",
}

let InterpolationInfoId = 0;
export const getNextInterpolationInfoId = () => InterpolationInfoId++;

export type InterpolationInfo = {
  itemId: number;
  id: number;
  key: string;
  label: string | undefined;
  interpolator: IAnimationValue;
  interpolate: InterpolateFunction;
  interpolationConfig: InterpolationConfig;
  animationType?: ConfigAnimationType;
  onBegin?: OnAnimationFunction;
  onEnd?: OnAnimationFunction;
  loop?: number;
  flip?: number;
  yoyo?: number;
};

export type OnAnimationFunction = () => void;

export type SharedInterpolationInfo = {
  fromLabel: string;
  toLabel: string;
};

export type SharedInterpolationType = {
  id: number;
  orgFromId: number;
  orgToId: number;
  fromLabel: string;
  toLabel: string;
  fromCloneLabel: string;
  toCloneLabel: string;
  fromId: number;
  toId: number;
  fromItem: TransitionItem;
  toItem: TransitionItem;
  status: SharedInterpolationStatus;
  direction?: ChildAnimationDirection;
  animation?: ConfigAnimationType;
  setupPromise?: Promise<void>;
  fromClone?: React.ReactElement;
  toClone?: React.ReactElement;
  onAnimationDone?: OnAnimationFunction;
  onAnimationFinished?: OnAnimationFunction;
  onAnimationBegin?: OnAnimationFunction;
};
