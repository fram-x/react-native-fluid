import { AnimationProvider } from "react-native-fluid-animations";
import { getInterpolatorFunction, Extrapolate } from "../interpolate";
import { interpolateValue } from "../interpolateValue";
import Easings from "../../../Functions/easing";

describe("interpolate", () => {
  it("should return 0 with linear easing", () => {
    const output = AnimationProvider.createValue(0);
    const easing = Easings.linear;
    const interpolate = getInterpolatorFunction(
      interpolateValue,
      "value",
      easing,
      "linear"
    );
    const statement = interpolate(
      0,
      0,
      1,
      0,
      1,
      Extrapolate.Extend,
      Extrapolate.Extend,
      output
    );
    (statement as any).evaluate();
    // @ts-ignore
    expect(output.__getValue()).toBe(0);
  });

  it("should return 1 with linear easing", () => {
    const output = AnimationProvider.createValue(0);
    const easing = Easings.linear;
    const interpolate = getInterpolatorFunction(
      interpolateValue,
      "value",
      easing,
      "linear"
    );
    (interpolate(
      1,
      0,
      1,
      0,
      1,
      Extrapolate.Extend,
      Extrapolate.Extend,
      output
    ) as any).evaluate();
    // @ts-ignore
    expect(output.__getValue()).toBe(1);
  });

  it("should return 0.5 with linear easing", () => {
    const output = AnimationProvider.createValue(0);
    const easing = Easings.elastic();
    const interpolate = getInterpolatorFunction(
      interpolateValue,
      "value",
      easing,
      "linear"
    );
    (interpolate(
      0.5,
      0,
      1,
      0,
      1,
      Extrapolate.Extend,
      Extrapolate.Extend,
      output
    ) as any).evaluate();
    // @ts-ignore
    expect(output.__getValue()).toBe(0.5);
  });

  it("should return 0 with elastic easing", () => {
    const output = AnimationProvider.createValue(0);
    const easing = Easings.elastic();
    const interpolate = getInterpolatorFunction(
      interpolateValue,
      "value",
      easing,
      "elastic"
    );
    (interpolate(
      0,
      0,
      1,
      0,
      1,
      Extrapolate.Extend,
      Extrapolate.Extend,
      output
    ) as any).evaluate();
    // @ts-ignore
    expect(output.__getValue()).toBe(0);
  });

  it("should return 1 with elastic easing", () => {
    const output = AnimationProvider.createValue(0);
    const easing = Easings.elastic();
    const interpolate = getInterpolatorFunction(
      interpolateValue,
      "value",
      easing,
      "elastic"
    );
    (interpolate(
      1,
      0,
      1,
      0,
      1,
      Extrapolate.Extend,
      Extrapolate.Extend,
      output
    ) as any).evaluate();
    // @ts-ignore
    expect(output.__getValue()).toBe(1);
  });
});
