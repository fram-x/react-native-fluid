import { IAnimationNode } from "react-native-fluid-animations";

let _functionCache: {
  [key: string]: (...args: IAnimationNode[]) => IAnimationNode;
} = {};

export const createProc = (
  key: string,
  cb: () => (...args: IAnimationNode[]) => IAnimationNode
): ((...args: IAnimationNode[]) => IAnimationNode) => {
  if (!_functionCache[key]) {
    _functionCache[key] = cb();
    Object.defineProperty(_functionCache[key], "name", { value: key });
  }
  return _functionCache[key];
};
