import { ReactNativeAnimationProvider as P, AnimatedNode } from "..";
const { Animated } = P;

describe("conditions", () => {
  it("should return truthy condition", () => {
    const truthy = true;
    const falsy = false;
    const expression = true;
    const valueToTest = (P.Animated.cond(
      expression,
      truthy,
      falsy
    ) as AnimatedNode).evaluate();
    expect(valueToTest).toBeTruthy();
  });

  it("should return falsy condition", () => {
    const truthy = true;
    const falsy = false;
    const expression = false;
    const valueToTest = (P.Animated.cond(
      expression,
      truthy,
      falsy
    ) as AnimatedNode).evaluate();
    expect(valueToTest).toBeFalsy();
  });

  it("should accept arrays as condition nodes and return true", () => {
    const truthy = [true];
    const falsy = [false];
    const expression = true;
    const valueToTest = (P.Animated.cond(
      expression,
      truthy,
      falsy
    ) as AnimatedNode).evaluate();
    expect(valueToTest).toBeTruthy();
  });

  it("should accept arrays as condition nodes and return falsy", () => {
    const truthy = [true];
    const falsy = [false];
    const expression = false;
    const valueToTest = (P.Animated.cond(
      expression,
      truthy,
      falsy
    ) as AnimatedNode).evaluate();
    expect(valueToTest).toBeFalsy();
  });

  it("should execute all statements in expression", () => {
    const a = P.createValue(0);
    const statement = [
      Animated.set(a, Animated.add(a, 10)),
      Animated.set(a, Animated.add(a, 10)),
      Animated.set(a, Animated.add(a, 10)),
      Animated.set(a, Animated.add(a, 10)),
      Animated.set(a, Animated.add(a, 10))
    ];
    const expression = true;
    const valueToTest = (P.Animated.cond(
      expression,
      statement
    ) as AnimatedNode).evaluate();
    expect(valueToTest).toBe(50);
  });
});
