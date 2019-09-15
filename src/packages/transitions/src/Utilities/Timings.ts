import { ConfigAnimationType } from "../Configuration";
import { Easings } from "../Components/Types/Easing";

export const DefaultTime = 330;
export const LongTime = 730;
export const MicroTime = 120;

export const TimingDefaultAnimationType: ConfigAnimationType = {
  type: "timing",
  duration: DefaultTime,
  easing: Easings.inOut(Easings.ease)
};

export const TimingLongAnimationType: ConfigAnimationType = {
  type: "timing",
  duration: LongTime,
  easing: Easings.inOut(Easings.ease)
};

export const TimingMicroAnimationType: ConfigAnimationType = {
  type: "timing",
  duration: MicroTime,
  easing: Easings.inOut(Easings.ease)
};
