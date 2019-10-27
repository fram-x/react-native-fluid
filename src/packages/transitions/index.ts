import {
  TransitionView,
  TransitionImage,
  TransitionText,
  TransitionScrollView,
  createFluidComponent,
} from "./src/Components";

import {
  InterpolatorContext,
  StateContext,
  StateContextType,
  DriverContext,
  DriverContextType,
} from "./src/Components/Types";
import { useFluidState, useFluidConfig } from "./src/Hooks";
import {
  createConfig,
  createState,
  OnFactoryFunction,
  WhenFactoryFunction,
  ConfigWhenType,
  ConfigOnType,
  ConfigStateType,
  ConfigType,
  ChildAnimationDirection,
  ConfigAnimationType,
  ConfigWhenFactoryType,
  ConfigOnFactoryType,
} from "./src/Configuration";
import {
  interpolateColor,
  interpolateValue,
} from "./src/Animation/Runner/Functions";

import { Springs } from "./src/Utilities/Springs";
import { Timings } from "./src/Utilities/Timings";

import * as Constants from "./src/Types/Constants";
import { Easings } from "./src/Components/Types";
import {
  MetricsInfo,
  StateMounted,
  StateUnmounted,
  ValueDescriptorType,
  ComponentProps,
} from "./src/Types";

const Animations = {
  Timings,
  Springs,
};

const States = {
  StateUnmounted,
  StateMounted,
};

export type StateConfig = ConfigStateType;
export type When = ConfigWhenType;
export type OnConfig = ConfigOnType;
export type DirectionConfig = ChildAnimationDirection;
export type AnimationConfig = ConfigAnimationType;
export type WhenFactoryConfig = ConfigWhenFactoryType;
export type OnFactoryConfig = ConfigOnFactoryType;

const Fluid = {
  View: TransitionView,
  Text: TransitionText,
  Image: TransitionImage,
  ScrollView: TransitionScrollView,
  States,
  Animations,
  Constants,
  createConfig,
};

export default Fluid;
export {
  Fluid,
  useFluidState,
  createConfig,
  createState,
  useFluidConfig,
  Easings,
  MetricsInfo,
  InterpolatorContext,
  StateContext,
  StateContextType,
  createFluidComponent,
  ValueDescriptorType,
  interpolateColor,
  interpolateValue,
  ComponentProps,
  DriverContext,
  DriverContextType,
  OnFactoryFunction,
  WhenFactoryFunction,
  ConfigStateType,
  ConfigWhenType,
  ConfigOnType,
  ConfigType,
  ChildAnimationDirection,
};
