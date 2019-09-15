import { getStyleValueFromKey } from "../getStyleValueFromKey";
describe("getStyleValueFromKey", () => {
  it("should return value from style for regular keys", () => {
    const style = { opacity: 1 };
    const valueToTest = getStyleValueFromKey("opacity", style);
    expect(valueToTest).toBe(1);
  });

  it("should return value from style for nested keys", () => {
    const style = { shadowOffset: { x: 1, y: 1 } };
    const valueToTest = getStyleValueFromKey("shadowOffset.x", style);
    expect(valueToTest).toBe(1);
  });

  it("should return value from style for regular keys when multiple keys exist", () => {
    const style = { opacity: 1, borderWidth: 10, something: "a" };
    const valueToTest = getStyleValueFromKey("borderWidth", style);
    expect(valueToTest).toBe(10);
  });

  it("should return value from style for nested keys", () => {
    const style = { transform: [{ translateX: 100 }] };
    const valueToTest = getStyleValueFromKey("transform.translateX", style);
    expect(valueToTest).toBe(100);
  });

  it("should return value from style for nested keys when multiple keys exist", () => {
    const style = { transform: [{ translateX: 100 }, { translateY: 200 }] };
    const valueToTest = getStyleValueFromKey("transform.translateY", style);
    expect(valueToTest).toBe(200);
  });

  it("should return value from style for transform with value zero", () => {
    const style = { transform: [{ translateX: 0 }] };
    const valueToTest = getStyleValueFromKey("transform.translateX", style);
    expect(valueToTest).toBe(0);
  });
});
