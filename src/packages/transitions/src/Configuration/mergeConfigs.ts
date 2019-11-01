import {
  ConfigType,
  ConfigWhenType,
  ConfigOnType,
  ConfigValueInterpolationType,
  SafeConfigType,
} from "./Types";
import { createConfig } from "./createConfig";

export const mergeConfigs = (...configs: ConfigType[]): SafeConfigType => {
  // Create empty config
  const empty = createConfig({});
  const retVal: SafeConfigType = {
    animation: empty.animation,
    childAnimation: empty.childAnimation || { type: "parallel" },
    when: [],
    onEnter: [],
    onExit: [],
    interpolation: [],
  };

  // Check if we have no configs to merge
  if (configs.length === 0) {
    return retVal;
  }

  const allConfigs = [retVal, ...configs];

  // Last animation/child animation wins
  retVal.animation = getLastValueDefined(allConfigs, c => c.animation);
  retVal.childAnimation = getLastValueDefined(
    allConfigs,
    c => c.childAnimation,
  );

  // Merge
  retVal.when = mergeArrays<ConfigWhenType>(
    allConfigs.map(c => resolveToArray(c.when)),
  );
  retVal.onEnter = mergeArrays<ConfigOnType>(
    allConfigs.map(c => resolveToArray(c.onEnter)),
  );
  retVal.onExit = mergeArrays<ConfigOnType>(
    allConfigs.map(c => resolveToArray(c.onExit)),
  );
  retVal.interpolation = mergeArrays<ConfigValueInterpolationType>(
    allConfigs.map(c => resolveToArray(c.interpolation)),
  );

  return retVal;
};

function resolveToArray<T>(arg: T | Array<T> | undefined) {
  return arg ? (arg instanceof Array ? arg : [arg]) : [];
}

function mergeArrays<T>(arrs: Array<Array<T>>) {
  return Array.prototype.concat.apply([], arrs) as Array<T>;
}

const getLastValueDefined = (
  arr: Array<ConfigType>,
  cb: (config: ConfigType) => any | undefined,
) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    const v = cb(arr[i]);
    if (v) {
      return v;
    }
  }
  return undefined;
};
