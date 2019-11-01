import { useFluidConfig } from "./useFluidConfig";
import {
  ConfigType,
  ConfigParallelChildAnimationType,
  ConfigStaggeredChildAnimationType,
  ConfigSequentialChildAnimationType,
} from "../Configuration/Types";

export function useChildAnimation(
  childAnimationType: ConfigSequentialChildAnimationType,
): ConfigType;

export function useChildAnimation(
  childAnimationType: ConfigParallelChildAnimationType,
): ConfigType;

export function useChildAnimation(
  childAnimationType: ConfigStaggeredChildAnimationType,
): ConfigType;

export function useChildAnimation(
  childAnimationType:
    | ConfigSequentialChildAnimationType
    | ConfigParallelChildAnimationType
    | ConfigStaggeredChildAnimationType,
): ConfigType {
  return useFluidConfig({ childAnimation: childAnimationType });
}
