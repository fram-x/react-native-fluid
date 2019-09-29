import Animated, { Easing } from "react-native-reanimated";
import { runTiming } from "./Implementation/runTiming";
import { IAnimationProvider } from "../Types/IAnimationProvider";
import { createValue } from "./Implementation/createValue";
import { getProcessedColor } from "./Implementation/getProcessedColor";
import { getProcessedRotation } from "./Implementation/getProcessedRotation";
import { isAnimatedNode } from "./Implementation/utils";
import { IAnimationValue, IAnimationNode } from "../Types";

// @ts-ignore
import { always } from "react-native-reanimated/src/base";

const {
  event,
  abs,
  add,
  multiply,
  round,
  concat,
  cond,
  set,
  eq,
  neq,
  divide,
  sub,
  call,
  block,
  and,
  proc,
  greaterOrEq,
  lessThan,
  greaterThan,
  lessOrEq,
  pow,
  cos,
  sin,
  exp,
  sqrt,
} = Animated;

export interface Animation {
  start: (callback: (value: any) => void) => void;
  stop: Function;
}

const ReanimatedAnimationProvider: IAnimationProvider = {
  runTiming,
  createValue,
  getNumericColor: getProcessedColor,
  getNumericRotation: getProcessedRotation,
  isAnimatedNode,
  createAnimatedComponent: Animated.createAnimatedComponent,
  getColorDisplayValue: (input: IAnimationValue) => input,
  getRadianDisplayValue: (input: IAnimationValue) => input,
  //concat(input as Animated.Value<number>, "rad"),
  getDisplayValue: (input: IAnimationValue) => input,
  configuration: {
    gestureConfiguration: { useNativeDriver: true },
  },
  Types: {
    View: Animated.View,
    Image: Animated.Image,
    ScrollView: Animated.ScrollView,
    Text: Animated.Text,
  },
  Animated: {
    // @ts-ignore
    event,
    round: (a: IAnimationNode) => round(a as Animated.Adaptable<number>),
    multiply: (
      a: IAnimationNode,
      b: IAnimationNode,
      ...others: IAnimationNode[]
    ) =>
      multiply(
        a as Animated.Adaptable<number>,
        b as Animated.Adaptable<number>,
        ...(others as Animated.Adaptable<number>[]),
      ),
    add: (a: IAnimationNode, b: IAnimationNode, ...others: IAnimationNode[]) =>
      add(
        a as Animated.Adaptable<number>,
        b as Animated.Adaptable<number>,
        ...(others as Animated.Adaptable<number>[]),
      ),
    sub: (a: IAnimationNode, b: IAnimationNode) =>
      sub(a as Animated.Adaptable<number>, b as Animated.Adaptable<number>),
    debug: (message: string, a: IAnimationNode) =>
      __DEV__
        ? call([a], (args: any) => console.log(message, args[0]))
        : Animated.debug(message, a),
    cond: (
      condNode: IAnimationNode,
      ifNode: IAnimationNode,
      elseNode?: IAnimationNode,
    ) =>
      cond(
        condNode as Animated.Adaptable<number>,
        ifNode as Animated.Node<number>,
        elseNode as Animated.Node<number>,
      ),
    set: (a: IAnimationNode, b: IAnimationNode) =>
      set(a as Animated.Value<number>, b as Animated.Adaptable<number>),
    eq: (a: IAnimationNode, b: IAnimationNode) =>
      eq(a as Animated.Adaptable<number>, b as Animated.Adaptable<number>),
    neq: (a: IAnimationNode, b: IAnimationNode) =>
      neq(a as Animated.Adaptable<number>, b as Animated.Adaptable<number>),
    divide: (a: IAnimationNode, b: IAnimationNode) =>
      divide(a as Animated.Adaptable<number>, b as Animated.Adaptable<number>),
    // @ts-ignore
    call,
    block,
    and: (a: IAnimationNode, b: IAnimationNode, ...others: IAnimationNode[]) =>
      and(
        a as Animated.Adaptable<number>,
        b as Animated.Adaptable<number>,
        ...(others as Animated.Adaptable<number>[]),
      ),
    proc: (
      _: string,
      cb: (
        ...params: Array<IAnimationNode | IAnimationValue>
      ) => IAnimationNode,
      // @ts-ignore
    ) => proc(cb),
    greaterOrEq: (a: IAnimationNode, b: IAnimationNode) =>
      greaterOrEq(
        a as Animated.Adaptable<number>,
        b as Animated.Adaptable<number>,
      ),
    lessThan: (a: IAnimationNode, b: IAnimationNode) =>
      lessThan(
        a as Animated.Adaptable<number>,
        b as Animated.Adaptable<number>,
      ),
    greaterThan: (a: IAnimationNode, b: IAnimationNode) =>
      greaterThan(
        a as Animated.Adaptable<number>,
        b as Animated.Adaptable<number>,
      ),
    pow: (a: IAnimationNode, b: IAnimationNode) =>
      pow(a as Animated.Adaptable<number>, b as Animated.Adaptable<number>),
    cos: (a: IAnimationNode) => cos(a as Animated.Adaptable<number>),
    sin: (a: IAnimationNode) => sin(a as Animated.Adaptable<number>),
    sqrt: (a: IAnimationNode) => sqrt(a as Animated.Adaptable<number>),
    abs: (a: IAnimationNode) => abs(a as Animated.Adaptable<number>),
    lessOrEq: (left: IAnimationNode, right: IAnimationNode) =>
      lessOrEq(
        left as Animated.Adaptable<number>,
        right as Animated.Adaptable<number>,
      ),
    exp: (a: IAnimationNode) => exp(a as Animated.Node<number>),
    always: (cb: () => IAnimationNode) => always(cb()),
    attach: (_source: IAnimationValue, node: IAnimationNode) => {
      // @ts-ignore
      (node as Animated.Node<any>).__attach();
    },

    detach: (_source: IAnimationValue, node: IAnimationNode) =>
      // @ts-ignore
      (node as Animated.Node<any>).__detach(),

    // @ts-ignore
    bezier: (x1: number, y1: number, x2: number, y2: number) =>
      Easing.bezier(x1, y1, x2, y2),
  },
};

export { ReanimatedAnimationProvider };
