import { Animated } from "react-native";
import { IAnimationProvider } from "../Types/IAnimationProvider";
import { runTiming } from "./Implementation/runTiming";
import { createValue } from "./Implementation/createValue";
import { IAnimationNode, IAnimationValue } from "../Types";
import { getProcessedColor } from "./Implementation/getProcessedColor";
import { getColorDisplayValue } from "./Implementation/getColorDisplayValue";
import { getProcessedRotation } from "./Implementation/getProcessedRotation";
import { isAnimatedNode } from "./Implementation/utils";
import { bezier } from "./Implementation/bezier";
import { RadNode } from "./Implementation/RadNode";

const { event } = Animated;

export type AnimatedNode = {
  name: string;
  evaluate: () => AnimatedNode;
  children: IAnimationNode[];
};

type AnimationValue = {
  __getValue: () => any;
};

type StackItem = {
  name: string;
  children: IAnimationNode[];
};

const stackTrace: Array<StackItem> = [];
const stackTraceToString = () => stackTrace.map(s => s.name);

const gestureConfiguration = {};
const evalNode = (input: IAnimationNode) => {
  let retVal: any;
  if (isNode(input)) {
    retVal = (input as AnimatedNode).evaluate();
  } else if (isAnimatedNode(input)) {
    retVal = (input as AnimationValue).__getValue();
  } else if (typeof input === "function") {
    retVal = (input as Function)();
  } else {
    if (typeof input === "string") {
      retVal = parseFloat(input as string);
    } else {
      retVal = input;
    }
  }
  return retVal;
};

const createBlockFunc = (items: ReadonlyArray<IAnimationNode>) =>
  createNode(
    "block",
    () => {
      const nodes = items.map((f: IAnimationNode) => evalNode(f));
      const last = nodes[nodes.length - 1];
      return last;
    },
    items,
  );

const createProxyNode = () => {
  const _argStack = new Array<IAnimationNode>();
  let cache: { [key: number]: any } = {};
  return {
    _argStack,
    beginCall: (value: IAnimationNode) => {
      _argStack.push(value);
    },
    endCall: () => {
      cache[_argStack.length] = undefined;
      _argStack.pop();
    },
    setValue: (value: IAnimationNode) => {
      // Cast and allow exception if not IAnimationNode
      (_argStack[_argStack.length - 1] as IAnimationValue).setValue(value);
    },
    __getValue: () => {
      if (!cache[_argStack.length]) {
        if (typeof _argStack[_argStack.length - 1] === "function") {
          cache[_argStack.length] = (_argStack[
            _argStack.length - 1
          ] as Function)();
        } else if (isProxyNode(_argStack[_argStack.length - 1])) {
          cache[_argStack.length] = (_argStack[
            _argStack.length - 1
          ] as AnimationValue).__getValue();
        } else {
          cache[_argStack.length] = _argStack[_argStack.length - 1];
        }
      }
      return evalNode(cache[_argStack.length]);
    },
  };
};

export function isProxyNode(value: Object): boolean {
  return (
    value &&
    Object.keys(value).find(k => k.startsWith("_argStack")) !== undefined
  );
}

const createNode = (
  name: string,
  evaluate: () => IAnimationNode,
  ...children: IAnimationNode[]
): AnimatedNode => {
  return {
    name,
    evaluate: () => {
      stackTrace.push({ name, children: children || [] });
      const node = evaluate();
      const retVal = evalNode(node);
      stackTrace.pop();
      return retVal;
    },
    children: children || [],
  };
};

const isNode = (node: IAnimationNode) =>
  node && node.hasOwnProperty("evaluate");

const ReactNativeAnimationProvider: IAnimationProvider = {
  getColorDisplayValue,
  getDisplayValue: (input: IAnimationValue) => input,
  getRadianDisplayValue: (input: IAnimationNode) => {
    return new RadNode(input as Animated.Value);
  },
  createAnimatedComponent: Animated.createAnimatedComponent,
  runTiming,
  createValue,
  isAnimatedNode,
  getNumericColor: getProcessedColor,
  getNumericRotation: getProcessedRotation,
  configuration: {
    gestureConfiguration,
  },
  Types: {
    View: Animated.View,
    Image: Animated.Image,
    ScrollView: Animated.ScrollView,
    Text: Animated.Text,
  },
  Animated: {
    event,

    /* Operators */

    add: (...args: IAnimationNode[]): IAnimationNode =>
      createNode(
        "add",
        () => {
          return args.reduce((a, b) => evalNode(a) + evalNode(b), 0);
        },
        ...args,
      ),

    multiply: (...args: IAnimationNode[]): IAnimationNode =>
      createNode(
        "multiply",
        () => args.reduce((a, b) => evalNode(a) * evalNode(b), 1),
        ...args,
      ),

    divide: (a: IAnimationNode, b: IAnimationNode): IAnimationNode =>
      createNode("divide", () => evalNode(a) / evalNode(b), a, b),

    pow: (a: IAnimationNode, b: IAnimationNode): IAnimationNode =>
      createNode("pow", () => Math.pow(evalNode(a), evalNode(b)), a, b),

    exp: (a: IAnimationNode): IAnimationNode =>
      createNode("exp", () => Math.exp(evalNode(a)), a),

    sqrt: (a: IAnimationNode): IAnimationNode =>
      createNode("sqrt", () => Math.sqrt(evalNode(a)), a),

    sin: (a: IAnimationNode): IAnimationNode =>
      createNode("sin", () => Math.sin(evalNode(a)), a),

    cos: (a: IAnimationNode): IAnimationNode =>
      createNode("cos", () => Math.cos(evalNode(a)), a),

    sub: (a: IAnimationNode, b: IAnimationNode): IAnimationNode =>
      createNode("sub", () => evalNode(a) - evalNode(b), a, b),

    round: (input: IAnimationNode): IAnimationNode =>
      createNode("round", () => Math.round(evalNode(input)), input),

    eq: (left: IAnimationNode, right: IAnimationNode) =>
      createNode("eq", () => evalNode(left) === evalNode(right), left, right),

    neq: (left: IAnimationNode, right: IAnimationNode) =>
      createNode("neq", () => evalNode(left) !== evalNode(right), left, right),

    abs: (a: IAnimationNode) => Math.abs(evalNode(a)),

    and: (
      left: IAnimationNode,
      right: IAnimationNode,
      // @ts-ignore
      ...others: IAnimationNode[]
    ) =>
      createNode(
        "and",
        () => {
          const nodes = [left, right, ...others];
          let retVal = evalNode(left);
          for (let i = 1; i < nodes.length; i++) {
            retVal = retVal && evalNode(nodes[i]);
          }
          return retVal;
        },
        ...[left, right, ...others],
      ),

    greaterOrEq: (left: IAnimationNode, right: IAnimationNode) =>
      createNode(
        "greaterOrEq",
        () => evalNode(left) >= evalNode(right),
        left,
        right,
      ),

    lessThan: (left: IAnimationNode, right: IAnimationNode) =>
      createNode(
        "lessThan",
        () => evalNode(left) < evalNode(right),
        left,
        right,
      ),

    greaterThan: (left: IAnimationNode, right: IAnimationNode) =>
      createNode(
        "greaterThan",
        () => evalNode(left) > evalNode(right),
        left,
        right,
      ),

    lessOrEq: (left: IAnimationNode, right: IAnimationNode) =>
      createNode(
        "lessOrEq",
        () => evalNode(left) <= evalNode(right),
        left,
        right,
      ),

    /* Statements */
    set: (target: IAnimationValue, source: IAnimationNode) =>
      createNode(
        "set",
        () => {
          const v = evalNode(source);
          if (Number.isNaN(v)) {
            const s = stackTrace;
            throw new Error(
              "Value is not a number\n" + stackTraceToString() + "\n" + s,
            );
          }
          target.setValue(v);
          return v;
        },
        target,
        source,
      ),

    block: (items: ReadonlyArray<IAnimationNode>) => createBlockFunc(items),

    cond: (
      expression: IAnimationNode,
      ifNode: IAnimationNode,
      elseNode?: IAnimationNode,
    ) => {
      const ifNodeResolved =
        ifNode instanceof Array ? createBlockFunc(ifNode) : ifNode;
      const elseNodeResolved =
        elseNode instanceof Array ? createBlockFunc(elseNode) : elseNode;

      return createNode(
        "cond",
        () => {
          const expr = evalNode(expression);
          const exec = expr ? ifNodeResolved : elseNodeResolved || 0;
          const retVal = evalNode(exec);
          return retVal;
        },
        ...(elseNode ? [expression, ifNode, elseNode] : [expression, ifNode]),
      );
    },

    call: (
      args: ReadonlyArray<IAnimationNode>,
      callback: (args: ReadonlyArray<number>) => void,
    ) =>
      createNode(
        "call",
        () => {
          callback(args.map(a => evalNode(a)));
          return 0;
        },
        ...args,
      ),

    /* Helpers */
    proc: (
      name: string,
      callback: (...params: Array<IAnimationNode>) => IAnimationNode,
    ) => {
      // Create argument nodes
      const params = new Array(callback.length);
      for (let i = 0; i < params.length; i++) {
        params[i] = createProxyNode();
      }
      const func = callback(...params);
      return (...args: Array<IAnimationNode>) =>
        createNode(
          `proc-(${name})`,
          () => {
            if (args.length !== params.length) {
              throw Error(
                `Expected ${params.length} arguments, got ${args.length}.`,
              );
            }

            params.forEach((p, i) => p.beginCall(args[i]));
            const retVal = (func as AnimatedNode).evaluate();
            params.forEach(p => p.endCall());
            return retVal;
          },
          ...args,
        );
    },

    always: (cb: (node: IAnimationNode) => IAnimationNode) =>
      createNode("always", () => {
        // We'll just return the node in RN Animated - since it
        // doesn't have to be marked for evaluation.
        // @ts-ignore
        return cb();
      }),

    attach: (source: IAnimationValue, node: IAnimationNode) => {
      // Add listener
      const id = (source as Animated.Value).addListener(() => evalNode(node));
      listeners[id] = node;
    },

    detach: (source: IAnimationValue, node: IAnimationNode) => {
      // Remove listener
      Object.keys(listeners).forEach(key => {
        if (listeners[key] === node) {
          (source as Animated.Value).removeListener(key);
        }
      });
    },

    debug: (msg: string, value: any) =>
      function debug() {
        console.log(`****** ${msg}: ${evalNode(value)}`);
        return evalNode(value);
      },

    bezier: (x1: number, y1: number, x2: number, y2: number) => {
      const bezierFunc = bezier(x1, y1, x2, y2);
      return (t: IAnimationNode): IAnimationNode =>
        createNode(
          "bezier",
          () => {
            return bezierFunc(evalNode(t));
          },
          t,
        );
    },
  },
};

const listeners: { [key: string]: IAnimationNode } = {};

export { ReactNativeAnimationProvider };
