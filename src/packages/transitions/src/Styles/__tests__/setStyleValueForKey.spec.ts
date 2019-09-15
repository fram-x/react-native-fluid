import { setStyleValueForKey } from "../setStyleValueForKey";

describe("setStyleValueForKey", () => {
  it("should update a value when the value is set", () => {
    const style = { opacity: 0 };
    const valueToTest = setStyleValueForKey("opacity", 1, style);
    expect(valueToTest.opacity).toBe(1);
  });

  it("should set a value when the value is not set", () => {
    const style = {};
    const valueToTest = setStyleValueForKey("opacity", 1, style);
    expect(valueToTest.opacity).toBe(1);
  });

  it("should update a shadowOffset value when it exists", () => {
    const style = { shadowOffset: { x: 0, y: 0 } };
    const valueToTest = setStyleValueForKey("shadowOffset.x", 1, style);
    expect(valueToTest.shadowOffset.x).toBe(1);
  });

  it("should set a shadowOffset value when does not it exists", () => {
    const style = {};
    const valueToTest = setStyleValueForKey("shadowOffset.x", 1, style);
    expect(valueToTest.shadowOffset.x).toBe(1);
  });

  it("should update a transform value", () => {
    const style = { transform: [{ scale: 0 }] };
    const valueToTest = setStyleValueForKey("transform.scale", 1, style);
    expect(valueToTest.transform[0].scale).toBe(1);
  });

  it("should set a transform value", () => {
    const style = { transform: [] };
    const valueToTest = setStyleValueForKey("transform.scale", 1, style);
    expect(valueToTest.transform[0].scale).toBe(1);
  });

  it("should set a transform value when transform is not set", () => {
    const style = {};
    const valueToTest = setStyleValueForKey("transform.scale", 1, style);
    expect(valueToTest.transform[0].scale).toBe(1);
  });
});
