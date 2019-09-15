import { validateConfig } from "../validateConfig";
import { createConfig } from "../createConfig";

describe("validateConfig", () => {
  it("should not allow any other elements than defined in schema", () => {
    const config = {
      ...completeMock,
      blah: 1,
      bluh: 2
    };
    const valueToTest = validateConfig(config);
    expect(valueToTest).toBeFalsy();
  });

  // it("should require one and only one animation", () => {
  //   const config = {
  //     ...completeMock,
  //     animation: [1, 3, 2]
  //   };
  //   const valueToTest = validateConfig(config);
  //   expect(valueToTest).toBeFalsy();
  // });

  // it("should validate config arrays", () => {
  //   const configA = {
  //     ...completeMock,
  //     animation: [1, 3, 2]
  //   };
  //   const configB = {
  //     ...completeMock
  //   };
  //   const valueToTest = validateConfig([configA, configB]);
  //   expect(valueToTest).toBeFalsy();
  // });

  it("should validate config arrays to valid", () => {
    const configA = {
      ...completeMock
    };
    const configB = {
      ...completeMock
    };
    const valueToTest = validateConfig([configA, configB]);
    expect(valueToTest).toBeTruthy();
  });
});

const completeMock = createConfig({});
