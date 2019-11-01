import {
  ConfigType,
  ConfigParallelChildAnimationType,
  ConfigStaggeredChildAnimationType,
  ConfigSequentialChildAnimationType,
  ConfigStaggerFunction,
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
  return { childAnimation: childAnimationType };
}

export function useStaggered(
  stagger: number | ConfigStaggerFunction,
): ConfigType {
  return useChildAnimation({ type: "staggered", stagger });
}

export function useSequential(): ConfigType {
  return useChildAnimation({ type: "sequential" });
}

export function useParallel(): ConfigType {
  return useChildAnimation({ type: "parallel" });
}
