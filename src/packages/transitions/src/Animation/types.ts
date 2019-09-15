import { InterpolationInfo } from "../Components/Types";
import { IAnimationNode } from "react-native-fluid-animations";

export type Interpolations = Array<{
  interpolator: IAnimationNode;
  interpolationInfo: InterpolationInfo;
}>;
