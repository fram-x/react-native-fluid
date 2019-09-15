import { getOutputRange } from "../getOutputRange";

describe("getoutputRange", () => {
  it("should throw an error if number of output values is 1", () => {
    const outputRange = [0];
    expect(() => getOutputRange(outputRange)).toThrowError();
  });

  it("should return the input when it contains no undefined values", () => {
    const outputRange = [0, 1, 2];
    expect(getOutputRange(outputRange)).toEqual([0, 1, 2]);
  });

  it("should only accept one undefined value in the array", () => {
    const outputRange = [0, undefined, 1, undefined];
    expect(() => getOutputRange(outputRange)).toThrowError();
  });

  it("should only accept one undefined value when the current value is set", () => {
    const outputRange = [0, undefined];
    expect(() => getOutputRange(outputRange)).toThrowError();
  });

  it("should replace the undefined element with the current value", () => {
    const outputRange = [0, undefined];
    expect(getOutputRange(outputRange, 10)).toEqual([0, 10]);
  });
});
