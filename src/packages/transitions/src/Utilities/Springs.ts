import {
  ConfigAnimationType,
  ConfigSpringAnimationType,
} from "../Configuration";

export const SpringNoWobbleAnimationType: ConfigAnimationType = {
  type: "spring",
  mass: 1,
  stiffness: 100,
  damping: 26,
};
export const SpringGentleAnimationType: ConfigAnimationType = {
  type: "spring",
  mass: 1,
  stiffness: 170,
  damping: 19,
};
export const SpringWobblyAnimationType: ConfigAnimationType = {
  type: "spring",
  mass: 1,
  stiffness: 180,
  damping: 12,
};
export const SpringWobblySlowAnimationType: ConfigAnimationType = {
  type: "spring",
  mass: 4,
  stiffness: 180,
  damping: 25,
};
export const SpringStiffAnimationType: ConfigAnimationType = {
  type: "spring",
  mass: 1,
  stiffness: 200,
  damping: 20,
};
export const SpringDefaultAnimationType: ConfigAnimationType = {
  type: "spring",
  mass: 1,
  stiffness: 100,
  damping: 10,
};

export const Springs = {
  get Default(): ConfigAnimationType {
    return SpringDefaultAnimationType;
  },
  get Gentle(): ConfigAnimationType {
    return SpringGentleAnimationType;
  },
  get NoWobble(): ConfigAnimationType {
    return SpringNoWobbleAnimationType;
  },
  get Stiff(): ConfigAnimationType {
    return SpringStiffAnimationType;
  },
  get Wobbly(): ConfigAnimationType {
    return SpringWobblyAnimationType;
  },
  get WobblySlow(): ConfigAnimationType {
    return SpringWobblySlowAnimationType;
  },
  spring: (
    mass: number = 1,
    stiffness: number = 100,
    damping: number = 10,
  ): ConfigSpringAnimationType => {
    return {
      type: "spring",
      mass,
      stiffness,
      damping,
    };
  },
};
