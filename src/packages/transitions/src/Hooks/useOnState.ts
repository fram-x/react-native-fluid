import { useFluidConfig } from "./useFluidConfig";
import {
  ConfigPropInterpolationType,
  ConfigStyleInterpolationType,
  ConfigStateType,
  ConfigType,
  OnFactoryFunction,
} from "../Configuration/Types";
import { createConfig } from "../Configuration";

const useOnState = (
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
): ConfigType => {
  let retVal: ConfigType;
  if (typeof param === "string") {
    retVal = createConfig({
      [key]: {
        state,
        fromLabel: param,
      },
    });
  } else if (typeof param === "function") {
    retVal = createConfig({
      [key]: {
        state,
        onFactory: param,
      },
    });
  } else {
    retVal = createConfig({
      [key]: {
        state,
        interpolation: param as (
          | ConfigPropInterpolationType
          | ConfigPropInterpolationType[]
          | ConfigStyleInterpolationType
          | ConfigStyleInterpolationType[]),
      },
    });
  }
  return useFluidConfig(retVal);
};

export function useOnEnterState(
  state: ConfigStateType | string,
  fromLabel: string,
): ConfigType;

export function useOnEnterState(
  state: ConfigStateType | string,
  onFactory: OnFactoryFunction,
): ConfigType;

export function useOnEnterState(
  state: ConfigStateType | string,
  interpolation:
    | ConfigPropInterpolationType
    | ConfigPropInterpolationType[]
    | ConfigStyleInterpolationType
    | ConfigStyleInterpolationType[],
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
): ConfigType {
  return useOnState("onEnter", state, param);
}

export function useOnExitState(
  state: ConfigStateType | string,
  fromLabel: string,
): ConfigType;

export function useOnExitState(
  state: ConfigStateType | string,
  onFactory: OnFactoryFunction,
): ConfigType;

export function useOnExitState(
  state: ConfigStateType | string,
  interpolation:
    | ConfigPropInterpolationType
    | ConfigPropInterpolationType[]
    | ConfigStyleInterpolationType
    | ConfigStyleInterpolationType[],
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
): ConfigType {
  return useOnState("onExit", state, param);
}

export {};
