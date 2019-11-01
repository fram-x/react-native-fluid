import {
  ConfigStateType,
  WhenFactoryFunction,
  createConfig,
  ConfigType,
} from "../Configuration";
import {
  BaseConfigType,
  ConfigPropInterpolationType,
  ConfigStyleInterpolationType,
  ConfigValueInterpolationType,
} from "../Configuration/Types";
import { StyleProp } from "react-native";
import { useFluidConfig } from "./useFluidConfig";

export function useWhenState(
  state: ConfigStateType | string,
  style: StyleProp<any>,
  options?: BaseConfigType,
): ConfigType;

export function useWhenState(
  state: ConfigStateType | string,
  interpolation:
    | ConfigPropInterpolationType
    | ConfigStyleInterpolationType
    | ConfigValueInterpolationType,
  options?: BaseConfigType,
): ConfigType;

export function useWhenState(
  state: ConfigStateType | string,
  whenFactory: WhenFactoryFunction,
  options?: BaseConfigType,
): ConfigType;

export function useWhenState(
  state: ConfigStateType | string,
  param:
    | StyleProp<any>
    | (
        | ConfigPropInterpolationType
        | ConfigStyleInterpolationType
        | ConfigValueInterpolationType)
    | WhenFactoryFunction,
  options?: BaseConfigType,
): ConfigType {
  let retVal: ConfigType;
  if (typeof param === "function") {
    retVal = createConfig({
      when: {
        state,
        whenFactory: param,
        ...(options ? options : {}),
      },
    });
  } else if (param.styleKey || param.propName) {
    retVal = createConfig({
      when: {
        state,
        interpolation: param,
        ...(options ? options : {}),
      },
    });
  } else {
    retVal = createConfig({
      when: {
        state,
        style: param,
        ...(options ? options : {}),
      },
    });
  }
  return retVal;
}
