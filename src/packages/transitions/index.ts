import {
  TransitionView,
  TransitionImage,
  TransitionText,
  TransitionScrollView,
  createFluidComponent,
} from "./src/Components";

import { InterpolatorContext, StateContext } from "./src/Components/Types";
import { useFluidState, useFluidConfig } from "./src/Hooks";
import { createConfig } from "./src/Configuration";
import {
  interpolateColor,
  interpolateValue,
} from "./src/Animation/Runner/Functions";

import {
  SpringDefaultAnimationType,
  SpringGentleAnimationType,
  SpringNoWobbleAnimationType,
  SpringStiffAnimationType,
  SpringWobblyAnimationType,
  SpringWobblySlowAnimationType,
} from "./src/Utilities/Springs";

import {
  TimingLongAnimationType,
  TimingMicroAnimationType,
  TimingDefaultAnimationType,
} from "./src/Utilities/Timings";

import * as Constants from "./src/Types/Constants";
import { Easings } from "./src/Components/Types";
import {
  MetricsInfo,
  StateMounted,
  StateUnmounted,
  ValueDescriptorType,
} from "./src/Types";

const Animations = {
  Timings: {
    Long: TimingLongAnimationType,
    Micro: TimingMicroAnimationType,
    Default: TimingDefaultAnimationType,
  },
  Springs: {
    Default: SpringDefaultAnimationType,
    Gentle: SpringGentleAnimationType,
    NoWobble: SpringNoWobbleAnimationType,
    Stiff: SpringStiffAnimationType,
    Wobbly: SpringWobblyAnimationType,
    WobblySlow: SpringWobblySlowAnimationType,
  },
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
  useFluidState,
  createConfig,
  useFluidConfig,
  Easings,
  // @ts-ignore
  MetricsInfo,
  InterpolatorContext,
  StateContext,
  createFluidComponent,
  // @ts-ignore
  ValueDescriptorType,
  interpolateColor,
  interpolateValue,
};
