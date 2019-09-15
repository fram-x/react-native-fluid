import { AnimationProvider } from "../../..";
import { AnimatedNode } from "..";
const { Animated } = AnimationProvider;

describe("bezier / linear", () => {
  it("should return 0", () => {
    const val = AnimationProvider.createValue(0);
    const retVal = Animated.bezier(0, 0, 1, 1)(val);
    expect((retVal as AnimatedNode).evaluate()).toBe(0);
  });

  it("should return 1", () => {
    const val = AnimationProvider.createValue(1);
    const retVal = Animated.bezier(0, 0, 1, 1)(val);
    expect((retVal as AnimatedNode).evaluate()).toBe(1);
  });

  it("should return 0.5", () => {
    const val = AnimationProvider.createValue(0.5);
    const retVal = Animated.bezier(0, 0, 1, 1)(val);
    expect((retVal as AnimatedNode).evaluate()).toBe(0.5);
  });
});

describe("bezier / curves", () => {
  it("should return 0.627", () => {
    const val = AnimationProvider.createValue(0.5);
    const retVal = Animated.bezier(0.17, 0.67, 0.83, 0.67)(val);
    expect((retVal as AnimatedNode).evaluate()).toBe(0.6275000000000001);
  });
});
