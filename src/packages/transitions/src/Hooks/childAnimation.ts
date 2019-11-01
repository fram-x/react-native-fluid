import {
  ConfigType,
  ConfigParallelChildAnimationType,
  ConfigStaggeredChildAnimationType,
  ConfigSequentialChildAnimationType,
  ConfigStaggerFunction,
} from "../Configuration/Types";

export function ChildAnimation(
  childAnimationType: ConfigSequentialChildAnimationType,
): ConfigType;

export function ChildAnimation(
  childAnimationType: ConfigParallelChildAnimationType,
): ConfigType;

export function ChildAnimation(
  childAnimationType: ConfigStaggeredChildAnimationType,
): ConfigType;

export function ChildAnimation(
  childAnimationType:
    | ConfigSequentialChildAnimationType
    | ConfigParallelChildAnimationType
    | ConfigStaggeredChildAnimationType,
): ConfigType {
  return { childAnimation: childAnimationType };
}

export function Staggered(stagger: number | ConfigStaggerFunction): ConfigType {
  return ChildAnimation({ type: "staggered", stagger });
}

export function Sequential(): ConfigType {
  return ChildAnimation({ type: "sequential" });
}

export function Parallel(): ConfigType {
  return ChildAnimation({ type: "parallel" });
}
