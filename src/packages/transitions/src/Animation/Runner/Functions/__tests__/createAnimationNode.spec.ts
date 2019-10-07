import { createAnimationNode } from "../createAnimationNode";
import { AnimationProvider } from "react-native-fluid-animations";
import { interpolateValue } from "../interpolateValue";
import Easings from "../../../Functions/easing";
import { EasingFunction } from "../../../../Components/Types/Easing";

describe("createAnimationNode / linear", () => {
  it("should return 1 for first value", () => {
    const valueToTest = evalAnimationNode(0, 1, 0, [0, 0.5, 1], [1, 1.5, 1]);
    // @ts-ignore
    expect(valueToTest.__getValue()).toBe(1);
  });

  it("should return 1.5 for middle", () => {
    const valueToTest = evalAnimationNode(0.5, 1, 0, [0, 0.5, 1], [1, 1.5, 1]);
    // @ts-ignore
    expect(valueToTest.__getValue()).toBe(1.5);
  });

  it("should return 1.25 for 0.75", () => {
    const valueToTest = evalAnimationNode(0.75, 1, 0, [0, 0.5, 1], [1, 1.5, 1]);
    // @ts-ignore
    expect(valueToTest.__getValue()).toBe(1.25);
  });

  it("should return 1.25 for 0.25", () => {
    const valueToTest = evalAnimationNode(0.25, 1, 0, [0, 0.5, 1], [1, 1.5, 1]);
    // @ts-ignore
    expect(valueToTest.__getValue()).toBe(1.25);
  });

  it("should return 1 for end", () => {
    const valueToTest = evalAnimationNode(1, 1, 0, [0, 0.5, 1], [1, 1.5, 1]);
    // @ts-ignore
    expect(valueToTest.__getValue()).toBe(1);
  });

  it("should return 1.5 for middle interpolated", () => {
    const valueToTest = evalAnimationNode(
      500,
      1000,
      0,
      [0, 0.5, 1],
      [1, 1.5, 1],
    );
    // @ts-ignore
    expect(valueToTest.__getValue()).toBe(1.5);
  });
});

describe("createAnimationNode / easing", () => {
  it("should return 1 for first value eased", () => {
    const easing = Easings.bezier(0, 0, 1, 1);
    const valueToTest = evalAnimationNode(
      0,
      1,
      0,
      [0, 0.5, 1],
      [1, 1.5, 1],
      easing,
      "bezier1",
    );
    // @ts-ignore
    expect(valueToTest.__getValue()).toBe(1);
  });

  // const easeOut = new Bezier(.17,.67,.83,.67);
  // const x = easeOut(0.5); // returns 0.627...
  it("should return 0.627 for eased value", () => {
    const easing = Easings.bezier(0.17, 0.67, 0.83, 0.67);
    const valueToTest = evalAnimationNode(
      0.5,
      1,
      0,
      [0, 0.5, 1],
      [0, 0.5, 1],
      easing,
      "bezier2",
    );
    // @ts-ignore
    expect(valueToTest.__getValue()).toBe(0.6275000000000001);
  });

  it("should return 0.627 for eased value with complex interpolation", () => {
    const easing = Easings.bezier(0.17, 0.67, 0.83, 0.67);
    const valueToTest = evalAnimationNode(
      0.5,
      1,
      0,
      [0, 0.25, 1],
      [0, 0.25, 1],
      easing,
      "bezier2",
    );
    // @ts-ignore
    expect(valueToTest.__getValue()).toBe(0.6275000000000001);
  });
});

const evalAnimationNode = (
  sourceVal: number,
  duration: number,
  offset: number,
  inputRange: number[],
  outputRange: number[],
  easingFunction: EasingFunction = Easings.linear,
  easingKey: string = "linear",
) => {
  const source = AnimationProvider.createValue(sourceVal);
  const target = AnimationProvider.createValue(0);
  const isRunning = AnimationProvider.createValue(1);
  const animationId = 10;
  const key = "scale";
  const ownerId = 100;
  const node = createAnimationNode(
    source,
    target,
    isRunning,
    animationId,
    key,
    ownerId,
    offset,
    duration,
    easingFunction,
    easingKey,
    inputRange,
    outputRange,
    "extend",
    "extend",
    "extend",
    () => {},
    () => {},
    interpolateValue,
  );
  // @ts-ignore
  node.evaluate();
  // @ts-ignore
  node.evaluate();
  return target;
};
