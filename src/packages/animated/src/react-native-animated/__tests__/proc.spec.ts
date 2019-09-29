import { ReactNativeAnimationProvider as P, AnimatedNode } from "..";
const { Animated } = P;

describe("proc", () => {
  it("should call proc", () => {
    const addNumbers = Animated.proc("", (a, b) => Animated.add(a, b));
    const valueToTest = addNumbers(10, 10);
    expect((valueToTest as AnimatedNode).evaluate()).toEqual(20);
  });

  it("should call nested procs", () => {
    const addNumbers = Animated.proc("", (a, b) => Animated.add(a, b));
    const valueToTest = addNumbers(10, addNumbers(10, 10));
    expect((valueToTest as AnimatedNode).evaluate()).toEqual(30);
  });

  it("should call composite procs", () => {
    const addNumbers = Animated.proc("", (a, b) => Animated.add(a, b));
    const multiplyNumber = Animated.proc("", (a, b) => Animated.multiply(a, b));
    const valueToTest = multiplyNumber(addNumbers(10, 10), addNumbers(10, 10));
    expect((valueToTest as AnimatedNode).evaluate()).toEqual(400);
  });

  it("should call with nested args", () => {
    const subcalc = Animated.proc("", (a, b) => Animated.add(a, b));
    const calculate = Animated.proc("", (a, b) =>
      Animated.multiply(subcalc(a, b), subcalc(a, b)),
    );
    const valueToTest = calculate(10, 10);
    expect((valueToTest as AnimatedNode).evaluate()).toEqual(400);
  });
});
