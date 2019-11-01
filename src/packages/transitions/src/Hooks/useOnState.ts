import {
  ConfigPropInterpolationType,
  ConfigStyleInterpolationType,
  ConfigStateType,
  ConfigType,
  OnFactoryFunction,
  BaseConfigOnType,
} from "../Configuration/Types";
import { createConfig } from "../Configuration";

const createOnState = (
  key: "onEnter" | "onExit",
  state: ConfigStateType | string,
  param:
    | OnFactoryFunction
    | (
        | ConfigPropInterpolationType
        | ConfigPropInterpolationType[]
        | ConfigStyleInterpolationType
        | ConfigStyleInterpolationType[])
    | string,
  options?: BaseConfigOnType,
): ConfigType => {
  let retVal: ConfigType;
  if (typeof param === "string") {
    retVal = createConfig({
      [key]: {
        state,
        ...(options ? options : {}),
        fromLabel: param,
      },
    });
  } else if (typeof param === "function") {
    retVal = createConfig({
      [key]: {
        state,
        ...(options ? options : {}),
        onFactory: param,
      },
    });
  } else {
    retVal = createConfig({
      [key]: {
        state,
        ...(options ? options : {}),
        interpolation: param as (
          | ConfigPropInterpolationType
          | ConfigPropInterpolationType[]
          | ConfigStyleInterpolationType
          | ConfigStyleInterpolationType[]),
      },
    });
  }
  return retVal;
};

export function useOnEnterState(
  state: ConfigStateType | string,
  fromLabel: string,
  options?: BaseConfigOnType,
): ConfigType;

export function useOnEnterState(
  state: ConfigStateType | string,
  onFactory: OnFactoryFunction,
  options?: BaseConfigOnType,
): ConfigType;

export function useOnEnterState(
  state: ConfigStateType | string,
  interpolation:
    | ConfigPropInterpolationType
    | ConfigPropInterpolationType[]
    | ConfigStyleInterpolationType
    | ConfigStyleInterpolationType[],
  options?: BaseConfigOnType,
): ConfigType;

export function useOnEnterState(
  state: ConfigStateType | string,
  param:
    | OnFactoryFunction
    | (
        | ConfigPropInterpolationType
        | ConfigPropInterpolationType[]
        | ConfigStyleInterpolationType
        | ConfigStyleInterpolationType[])
    | string,
  options?: BaseConfigOnType,
): ConfigType {
  return createOnState("onEnter", state, param, options);
}

export function useOnExitState(
  state: ConfigStateType | string,
  fromLabel: string,
  options?: BaseConfigOnType,
): ConfigType;

export function useOnExitState(
  state: ConfigStateType | string,
  onFactory: OnFactoryFunction,
  options?: BaseConfigOnType,
): ConfigType;

export function useOnExitState(
  state: ConfigStateType | string,
  interpolation:
    | ConfigPropInterpolationType
    | ConfigPropInterpolationType[]
    | ConfigStyleInterpolationType
    | ConfigStyleInterpolationType[],
  options?: BaseConfigOnType,
): ConfigType;

export function useOnExitState(
  state: ConfigStateType | string,
  param:
    | OnFactoryFunction
    | (
        | ConfigPropInterpolationType
        | ConfigPropInterpolationType[]
        | ConfigStyleInterpolationType
        | ConfigStyleInterpolationType[])
    | string,
  options?: BaseConfigOnType,
): ConfigType {
  return createOnState("onExit", state, param, options);
}

export {};
