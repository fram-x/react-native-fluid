import { IAnimationNode } from "./IAnimationNode";

export interface IAnimationValue extends IAnimationNode {
  setValue: (value: any) => void;
}
