import { ConfigStyleInterpolationType } from "../Configuration";

export const createOpacityOverlapConfig = (
  output: Array<number>
): ConfigStyleInterpolationType => {
  return {
    styleKey: "opacity",
    inputRange: [0, 0.2, 0.8, 1],
    outputRange: output,
    extrapolate: "clamp"
  };
};
