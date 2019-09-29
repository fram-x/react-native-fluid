import {
  ConfigAnimationType,
  ConfigTimingAnimationType,
} from "../Configuration";
import { Easings, EasingFunction } from "../Components/Types/Easing";

export const DefaultTime = 330;
export const LongTime = 730;
export const MicroTime = 120;

export const TimingDefaultAnimationType: ConfigAnimationType = {
  type: "timing",
  duration: DefaultTime,
  easing: Easings.inOut(Easings.ease),
};

export const TimingLongAnimationType: ConfigAnimationType = {
  type: "timing",
  duration: LongTime,
  easing: Easings.inOut(Easings.ease),
};

export const TimingMicroAnimationType: ConfigAnimationType = {
  type: "timing",
  duration: MicroTime,
  easing: Easings.inOut(Easings.ease),
};

export const Timings = {
  get Long(): ConfigAnimationType {
    return TimingLongAnimationType;
  },
  get Micro(): ConfigAnimationType {
    return TimingMicroAnimationType;
  },
  get Default(): ConfigAnimationType {
    return TimingDefaultAnimationType;
  },
  timing: (
    easing: EasingFunction = Easings.inOut(Easings.ease),
    duration: number = DefaultTime,
    delay: number = 0,
  ): ConfigTimingAnimationType => {
    return {
      type: "timing",
      duration,
      delay,
      easing,
    };
  },
};
