// @ts-ignore
import { AnimationProvider, Easings } from "react-native-fluid-animations";
import { normalize } from "../normalize";

describe("interpolate", () => {
  it("should return 0", () => {
    const input = AnimationProvider.createValue(0);
    const offset = AnimationProvider.createValue(0);
    const duration = AnimationProvider.createValue(1000);
    const valueToTest = normalize(input, offset, duration);
    expect((valueToTest as any).evaluate()).toBe(0);
  });

  it("should return 1", () => {
    const input = AnimationProvider.createValue(1000);
    const offset = AnimationProvider.createValue(0);
    const duration = AnimationProvider.createValue(1000);
    const valueToTest = normalize(input, offset, duration);
    expect((valueToTest as any).evaluate()).toBe(1);
  });

  it("should return 0.5", () => {
    const input = AnimationProvider.createValue(500);
    const offset = AnimationProvider.createValue(0);
    const duration = AnimationProvider.createValue(1000);
    const valueToTest = normalize(input, offset, duration);
    expect((valueToTest as any).evaluate()).toBe(0.5);
  });

  it("should return 0.25 for an offset off 0.5", () => {
    const input = AnimationProvider.createValue(0.75);
    const offset = AnimationProvider.createValue(0.5);
    const duration = AnimationProvider.createValue(1);
    const valueToTest = normalize(input, offset, duration);
    expect((valueToTest as any).evaluate()).toBe(0.25);
  });

  it("should return negative values for input below zero", () => {
    const input = AnimationProvider.createValue(0.25);
    const offset = AnimationProvider.createValue(0.5);
    const duration = AnimationProvider.createValue(1);
    const valueToTest = normalize(input, offset, duration);
    expect((valueToTest as any).evaluate()).toBe(-0.25);
  });

  it("should return 1 for values above 1", () => {
    const input = AnimationProvider.createValue(3);
    const offset = AnimationProvider.createValue(1);
    const duration = AnimationProvider.createValue(2);
    const valueToTest = normalize(input, offset, duration);
    expect((valueToTest as any).evaluate()).toBe(1);
  });
});
