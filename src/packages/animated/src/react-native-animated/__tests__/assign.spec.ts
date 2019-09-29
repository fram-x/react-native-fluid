import { ReactNativeAnimationProvider as P, AnimatedNode } from "..";
const { Animated } = P;

describe("assign", () => {
  it("should assign numberic value", () => {
    const a = P.createValue(1);
    const statement = Animated.set(a, 10);
    const valueToTest = (statement as AnimatedNode).evaluate();
    expect(valueToTest).toBe(10);
  });

  it("should assign animated value", () => {
    const a = P.createValue(1);
    const b = P.createValue(2);
    const statement = Animated.set(a, b);
    const valueToTest = (statement as AnimatedNode).evaluate();
    expect(valueToTest).toEqual(2);
  });

  it("should assign expression", () => {
    const a = P.createValue(1);
    const b = P.createValue(2);
    const expression = Animated.add(a, b);
    const statement = Animated.set(a, expression);
    const valueToTest = (statement as AnimatedNode).evaluate();
    expect(valueToTest).toEqual(3);
  });
});
