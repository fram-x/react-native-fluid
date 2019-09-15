import {
  ConfigType,
  ConfigWhenType,
  ConfigOnType,
  ConfigValueInterpolationType
} from "./Types";

/**
 * Creates a new Config type object
 */
export const createConfig = (config: ConfigType): ConfigType => {
  return {
    animation: config.animation,
    childAnimation: config.childAnimation,
    when: resolveToArray<ConfigWhenType>(config.when),
    onEnter: resolveToArray<ConfigOnType>(config.onEnter),
    onExit: resolveToArray<ConfigOnType>(config.onExit),
    interpolation: resolveToArray<ConfigValueInterpolationType>(
      config.interpolation
    )
  };
};

function resolveToArray<T>(input: Array<T> | T | undefined): Array<T> {
  return input ? (input instanceof Array ? input : [input]) : [];
}
