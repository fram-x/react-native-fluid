import { ReactNativeAnimationProvider as P, AnimatedNode } from "..";
const { Animated } = P;

describe("assign", () => {
  it("should execute all nodes in a block", () => {
    const a = P.createValue(1);
    const statement = Animated.block([
      Animated.set(a, Animated.add(a, 10)),
      Animated.set(a, Animated.add(a, 10)),
      Animated.set(a, Animated.add(a, 10)),
      Animated.set(a, Animated.add(a, 10)),
      Animated.set(a, Animated.add(a, 10))
    ]);
    const valueToTest = (statement as AnimatedNode).evaluate();
    expect(valueToTest).toBe(51);
  });
});
