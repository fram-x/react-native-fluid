import { mergeConfigs } from "../mergeConfigs";
import { createConfig } from "../createConfig";
import {
  SpringDefaultAnimationType,
  TimingDefaultAnimationType
} from "../../Utilities";

describe("mergeConfigs", () => {
  it("should use the last animation when merging two configs", () => {
    const configA = createConfig({
      animation: SpringDefaultAnimationType
    });
    const configB = createConfig({
      animation: TimingDefaultAnimationType
    });
    const configToTest = mergeConfigs(configA, configB);
    expect(configToTest.animation).toEqual(TimingDefaultAnimationType);
  });

  it("should use the last set animation when merging two configs", () => {
    const configA = createConfig({
      animation: SpringDefaultAnimationType
    });
    const configB = createConfig({});
    configB.animation = undefined;

    const configToTest = mergeConfigs(configA, configB);
    expect(configToTest.animation).toEqual(SpringDefaultAnimationType);
  });
});
