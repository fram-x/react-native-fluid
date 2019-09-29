import Animated from "react-native-reanimated";
import { IAnimationNode, IAnimationValue } from "../../Types";
import { isAnimatedNode } from "./utils";
// @ts-ignore
import { always } from "react-native-reanimated/src/base";

const { set, eq, cond, call } = Animated;

export const createValue = (v: number | IAnimationNode): IAnimationValue => {
  if (isAnimatedNode(v)) {
    const retVal = new Animated.Value(0);
    const flag = new Animated.Value(0);

    const evaluateOnce = cond(eq(flag, 0), [
      set(flag, 1),
      set(retVal, v as Animated.Node<number>),
      call([], () => {
        // @ts-ignore
        alwaysNode.__detach();
      }),
    ]);

    const alwaysNode = always(evaluateOnce);
    // @ts-ignore
    alwaysNode.__attach();
    return retVal;
  }
  return new Animated.Value(v as number);
};
