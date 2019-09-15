import { createSpring } from "./spring";
import {
  ConfigTimingAnimationType,
  ConfigAnimationType
} from "../../Configuration";

export const getResolvedAnimation = (
  animation: ConfigAnimationType
): ConfigTimingAnimationType => {
  if (animation.type === "spring") {
    // We need to change to a timing animation with easing
    const springInfo = createSpring(
      0,
      1,
      animation.mass,
      animation.stiffness,
      animation.damping
    );
    return {
      ...animation,
      type: "timing",
      duration: springInfo.duration,
      easing: springInfo.easing
    };
  }
  return animation;
};
