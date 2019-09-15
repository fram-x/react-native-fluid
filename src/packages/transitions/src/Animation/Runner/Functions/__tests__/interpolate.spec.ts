// @ts-ignore
import { AnimationProvider } from "react-native-fluid-animations";
import { getInterpolatorFunction, Extrapolate } from "../interpolate";
import { interpolateValue } from "../interpolateValue";

describe("interpolate", () => {
  it("should return minValue with input 0", () => {
    const output = AnimationProvider.createValue(0);
    const input = AnimationProvider.createValue(1);
    const interpolate = getInterpolatorFunction(interpolateValue, "value");
    (interpolate(
      input,
      0,
      1,
      0,
      100,
      Extrapolate.Extend,
      Extrapolate.Extend,
      output
    ) as any).evaluate();
    // @ts-ignore
    expect(output.__getValue()).toBe(100);
  });

  it("should return maxValue for input 1", () => {
    const output = AnimationProvider.createValue(1);
    const input = AnimationProvider.createValue(1);
    const interpolate = getInterpolatorFunction(interpolateValue, "value");
    (interpolate(
      input,
      0,
      1,
      0,
      100,
      Extrapolate.Extend,
      Extrapolate.Extend,
      output
    ) as any).evaluate();
    // @ts-ignore
    expect(output.__getValue()).toBe(100);
  });

  it("should return middle for input 0.5", () => {
    const output = AnimationProvider.createValue(0);
    const input = AnimationProvider.createValue(0.5);
    const interpolate = getInterpolatorFunction(interpolateValue, "value");
    (interpolate(
      input,
      0,
      1,
      0,
      100,
      Extrapolate.Extend,
      Extrapolate.Extend,
      output
    ) as any).evaluate();
    // @ts-ignore
    expect(output.__getValue()).toBe(50);
  });
});

describe("interpolate / extrapolate", () => {
  it("should return inputMin when clamped left", () => {
    const output = AnimationProvider.createValue(0);
    const input = AnimationProvider.createValue(-1);
    const interpolate = getInterpolatorFunction(interpolateValue, "value");
    (interpolate(
      input,
      0,
      1,
      0,
      100,
      Extrapolate.Clamp,
      Extrapolate.Extend,
      output
    ) as any).evaluate();
    // @ts-ignore
    expect(output.__getValue()).toBe(0);
  });

  it("should return outputMax when clamped right", () => {
    const output = AnimationProvider.createValue(0);
    const interpolate = getInterpolatorFunction(interpolateValue, "value");
    (interpolate(
      2,
      0,
      1,
      0,
      100,
      Extrapolate.Extend,
      Extrapolate.Clamp,
      output
    ) as any).evaluate();
    // @ts-ignore
    expect(output.__getValue()).toBe(100);
  });

  it("should return input when identiy left", () => {
    const output = AnimationProvider.createValue(5);
    const interpolate = getInterpolatorFunction(interpolateValue, "value");
    (interpolate(
      -1,
      0,
      1,
      0,
      100,
      Extrapolate.Identity,
      Extrapolate.Extend,
      output
    ) as any).evaluate();
    // @ts-ignore
    expect(output.__getValue()).toBe(-1);
  });

  it("should return input when identiy right", () => {
    const output = AnimationProvider.createValue(5);
    const interpolate = getInterpolatorFunction(interpolateValue, "value");
    (interpolate(
      2,
      0,
      1,
      0,
      100,
      Extrapolate.Extend,
      Extrapolate.Identity,
      output
    ) as any).evaluate();
    // @ts-ignore
    expect(output.__getValue()).toBe(2);
  });
});
