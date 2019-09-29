import { IAnimationValue } from "./IAnimationValue";
import { IAnimationNode } from "./IAnimationNode";

export type InterpolateFunction = (
  input: IAnimationNode,
  inputMin: any,
  inputMax: any,
  outputMin: any,
  outputMax: any,
) => any;

export interface IAnimationProvider {
  /**
   * @returns Returns a node representing the numeric input node.
   */
  getDisplayValue: (input: IAnimationValue) => IAnimationNode;

  /**
   * @returns Returns a color node representing the numeric input node.
   */
  getColorDisplayValue: (input: IAnimationValue) => IAnimationNode;

  /**
   * @returns Returns a radian node representing the numeric input node.
   */
  getRadianDisplayValue: (input: IAnimationValue) => IAnimationNode;

  /**
   * @description Creates a timing based animation
   */
  runTiming: (
    master: IAnimationValue,
    duration: number,
    callback?: () => void,
  ) => void;

  /**
   * @description Creates an animated value
   */
  createValue: (v: number | IAnimationNode) => IAnimationValue;

  /**
   * @description Returns the numeric representation for a color value
   * @param value Original value from stylesheet
   */
  getNumericColor: (
    value: IAnimationNode | string | number,
  ) => IAnimationNode | number;

  /**
   * @description Returns the numeric value
   * @param value Original value from stylesheet
   */
  getNumericRotation: (
    value: IAnimationNode | string,
  ) => IAnimationNode | number;

  /**
   * @description Return true if input is a valid node
   */
  isAnimatedNode: (value: any) => boolean;

  /**
   * @description Creates an animation component
   */
  createAnimatedComponent: (component: any) => any;

  configuration: {
    gestureConfiguration: Object;
  };
  Types: {
    View: any;
    Image: any;
    Text: any;
    ScrollView: any;
  };
  Animated: {
    round: (inputNode: IAnimationNode) => IAnimationNode;
    event: (argMapping: any[], config?: Object) => Function;
    multiply: (...args: IAnimationNode[]) => IAnimationNode;
    add: (
      a: IAnimationNode,
      b: IAnimationNode,
      ...others: IAnimationNode[]
    ) => IAnimationNode;
    divide: (a: IAnimationNode, b: IAnimationNode) => IAnimationNode;
    sub: (a: IAnimationNode, b: IAnimationNode) => IAnimationNode;
    pow: (a: IAnimationNode, b: IAnimationNode) => IAnimationNode;
    sqrt: (a: IAnimationNode) => IAnimationNode;
    cos: (a: IAnimationNode) => IAnimationNode;
    sin: (a: IAnimationNode) => IAnimationNode;
    exp: (a: IAnimationNode) => IAnimationNode;
    abs: (a: IAnimationNode) => IAnimationNode;
    debug: (a: string, b: IAnimationNode) => IAnimationNode;

    cond: (
      conditionNode: IAnimationNode,
      ifNode: IAnimationNode,
      elseNode?: IAnimationNode,
    ) => IAnimationNode;
    set: (
      valueToBeUpdated: IAnimationValue,
      sourceNode: IAnimationNode,
    ) => IAnimationNode;
    eq: (left: IAnimationNode, right: IAnimationNode) => IAnimationNode;
    neq: (left: IAnimationNode, right: IAnimationNode) => IAnimationNode;
    and: (
      left: IAnimationNode,
      right: IAnimationNode,
      ...others: IAnimationNode[]
    ) => IAnimationNode;
    greaterOrEq: (
      left: IAnimationNode,
      right: IAnimationNode,
    ) => IAnimationNode;
    lessThan: (left: IAnimationNode, right: IAnimationNode) => IAnimationNode;
    greaterThan: (
      left: IAnimationNode,
      right: IAnimationNode,
    ) => IAnimationNode;
    lessOrEq: (left: IAnimationNode, right: IAnimationNode) => IAnimationNode;
    call: (
      args: ReadonlyArray<IAnimationNode>,
      callback: (args: ReadonlyArray<number>) => void,
    ) => void;
    block: (items: ReadonlyArray<IAnimationNode>) => IAnimationNode;
    proc: (
      name: string,
      cb: (
        ...params: Array<IAnimationNode | IAnimationValue>
      ) => IAnimationNode,
    ) => (...args: Array<IAnimationNode>) => IAnimationNode;
    always: (cb: () => IAnimationNode) => IAnimationNode;
    attach: (source: IAnimationValue, node: IAnimationNode) => void;
    detach: (source: IAnimationValue, node: IAnimationNode) => void;

    bezier: (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
    ) => (t: IAnimationNode) => IAnimationNode;
  };
}
