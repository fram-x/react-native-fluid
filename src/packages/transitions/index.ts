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
  ConfigStateType,
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
  OnFactoryFunction,
  DriverContext,
  DriverContextType,
  WhenFactoryFunction,
  ConfigStateType,
};
