import { getInputRange } from "../getInputRange";

describe("getinputRange", () => {
  it("should return input values array if set", () => {
    const inputRange = [0, 1];
    expect(getInputRange(inputRange, [0, 1])).toEqual([0, 1]);
  });

  it("should throw an error if inputRange and outputRange are set but differ in length", () => {
    const inputRange = [0, 1];
    const outputRange = [0, 1, 2];
    expect(() => getInputRange(inputRange, outputRange)).toThrowError();
  });

  it("should throw an error if inputRange is set and values are not in ascending order.", () => {
    const inputRange = [0, 1, 0.5];
    const outputRange = [0, 1, 2];
    expect(() => getInputRange(inputRange, outputRange)).toThrowError();
  });

  it("should return a normalized input range when input range is not set", () => {
    const outputRange = [0, 1, 2];
    const valueToTest = getInputRange(undefined, outputRange);
    expect(valueToTest).toEqual([0, 0.5, 1]);
  });

  it("should return a normalized input range when input range is not set 2", () => {
    const outputRange = [0, 1, 2, 4, 7];
    const valueToTest = getInputRange(undefined, outputRange);
    expect(valueToTest.length).toBe(outputRange.length);
    expect(valueToTest).toEqual([0, 0.25, 0.5, 0.75, 1]);
  });
});
