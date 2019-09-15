// @ts-ignore
import { AnimationNode } from "react-native-fluid-animations";
import { interpolateColor } from "../interpolateColor";

describe("interpolateColor", () => {
  it("should return 0xff000000", () => {
    const valueToTest = interpolateColor(1, 0, 1, 0x00000000, 0xff000000);
    expect((valueToTest as AnimationNode).evaluate()).toBe(0xff000000);
  });
  it("should return 0x00ff0000", () => {
    const valueToTest = interpolateColor(1, 0, 1, 0xff000000, 0x00ff0000);
    expect((valueToTest as AnimationNode).evaluate()).toBe(0x00ff0000);
  });
  it("should return 0x00aa0000", () => {
    const valueToTest = interpolateColor(1, 0, 1, 0xff000000, 0x00aa0000);
    expect((valueToTest as AnimationNode).evaluate()).toBe(0x00aa0000);
  });
});
