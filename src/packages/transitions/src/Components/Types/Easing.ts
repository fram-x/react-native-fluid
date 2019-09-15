import { IAnimationNode } from "react-native-fluid-animations";
import Easings from "../../Animation/Functions/easing";

export type EasingFunction = (t: IAnimationNode) => IAnimationNode;

export { Easings };
