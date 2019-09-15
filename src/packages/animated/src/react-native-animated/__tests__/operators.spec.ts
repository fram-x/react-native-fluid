import { ReactNativeAnimationProvider as P, AnimatedNode } from "..";
import { AnimationProvider } from "../../../";

describe("operators", () => {
  it("should add two numbers", () => {
    const left = P.Animated.add(1, 1);
    const right = AnimationProvider.createValue(1);
    const retVal = P.Animated.add(left, right) as AnimatedNode;
    expect(retVal.evaluate()).toBe(3);
  });

  it("should add multiple numbers", () => {
    const left = AnimationProvider.createValue(1);
    const right = AnimationProvider.createValue(1);
    const a = AnimationProvider.createValue(1);
    const b = AnimationProvider.createValue(1);
    const retVal = P.Animated.add(left, right, a, b) as AnimatedNode;
    expect(retVal.evaluate()).toBe(4);
  });

  it("should add multiple numbers and expressions", () => {
    const left = AnimationProvider.createValue(1);
    const right = AnimationProvider.createValue(1);
    const a = AnimationProvider.createValue(1);
    const b = AnimationProvider.createValue(1);
    const retVal = P.Animated.add(left, right, a, b) as AnimatedNode;
    expect(retVal.evaluate()).toBe(4);
  });

  it("should subtract two numbers", () => {
    const retVal = P.Animated.sub(2, 1) as AnimatedNode;
    expect(retVal.evaluate()).toBe(1);
  });

  it("should divide two numbers", () => {
    const retVal = P.Animated.divide(2, 2) as AnimatedNode;
    expect(retVal.evaluate()).toBe(1);
  });

  it("should multiply two numbers", () => {
    const retVal = P.Animated.multiply(2, 2) as AnimatedNode;
    expect(retVal.evaluate()).toBe(4);
  });

  it("should return lessThan", () => {
    const retVal = P.Animated.lessThan(2, 2) as AnimatedNode;
    expect(retVal.evaluate()).toBeFalsy();
  });

  it("should return greaterThan", () => {
    const retVal = P.Animated.greaterThan(2, 1) as AnimatedNode;
    expect(retVal.evaluate()).toBeTruthy();
  });

  it("should return greaterThanOrEqual", () => {
    const retVal = P.Animated.greaterOrEq(2, 2) as AnimatedNode;
    expect(retVal.evaluate()).toBeTruthy();
  });

  it("should return lessThanOrEqual", () => {
    const retVal = P.Animated.lessOrEq(2, 2) as AnimatedNode;
    expect(retVal.evaluate()).toBeTruthy();
  });
});
